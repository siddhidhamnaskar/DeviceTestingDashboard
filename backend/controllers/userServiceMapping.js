const { UserServiceMapping, DashboardUser, MqttMacMapping } = require('../models');
const { Op } = require('sequelize');

// Get all user service mappings
const getAllUserServiceMappings = async (req, res) => {
  try {
    const userServiceMappings = await UserServiceMapping.findAll({
      include: [
        {
          model: DashboardUser,
          as: 'user',
          attributes: ['id', 'email', 'isAdmin', 'isSuperAdmin']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: userServiceMappings
    });
  } catch (error) {
    console.error('Error fetching user service mappings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user service mappings',
      error: error.message
    });
  }
};

// Get user service mappings by user ID
const getUserServiceMappingsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const userServiceMappings = await UserServiceMapping.findAll({
      where: { userId },
      include: [
        {
          model: DashboardUser,
          as: 'user',
          attributes: ['id', 'email', 'isAdmin', 'isSuperAdmin']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: userServiceMappings
    });
  } catch (error) {
    console.error('Error fetching user service mappings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user service mappings',
      error: error.message
    });
  }
};

// Get available cities, sites, and categories for filtering
const getAvailableFilters = async (req, res) => {
  try {
    // Get unique cities, sites, and categories from MqttMacMapping
    const cities = await MqttMacMapping.findAll({
      attributes: [[require('sequelize').fn('DISTINCT', require('sequelize').col('City')), 'city']],
      where: {
        City: {
          [Op.not]: null,
          [Op.ne]: ''
        }
      },
      order: [['City', 'ASC']]
    });

    const sites = await MqttMacMapping.findAll({
      attributes: [[require('sequelize').fn('DISTINCT', require('sequelize').col('site')), 'site']],
      where: {
        site: {
          [Op.not]: null,
          [Op.ne]: ''
        }
      },
      order: [['site', 'ASC']]
    });

    const categories = await MqttMacMapping.findAll({
      attributes: [[require('sequelize').fn('DISTINCT', require('sequelize').col('category')), 'category']],
      where: {
        category: {
          [Op.not]: null,
          [Op.ne]: ''
        }
      },
      order: [['category', 'ASC']]
    });

    const availableFilters = {
      cities: cities.map(item => item.getDataValue('city')).filter(city => city),
      sites: sites.map(item => item.getDataValue('site')).filter(site => site),
      categories: categories.map(item => item.getDataValue('category')).filter(category => category)
    };

    res.json({
      success: true,
      data: availableFilters
    });
  } catch (error) {
    console.error('Error fetching available filters:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available filters',
      error: error.message
    });
  }
};

// Create new user service mapping
const createUserServiceMapping = async (req, res) => {
  try {
    const { userId, city, site, category, canView, canEdit, canDelete, canCreate } = req.body;
    
    // Validate required fields
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Check if user exists
    const user = await DashboardUser.findByPk(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if mapping already exists for this user with same filters
    const existingMapping = await UserServiceMapping.findOne({
      where: {
        userId,
        city: city || null,
        site: site || null,
        category: category || null
      }
    });

    if (existingMapping) {
      return res.status(400).json({
        success: false,
        message: 'Service mapping already exists for this user with the same filters'
      });
    }
    
    const newUserServiceMapping = await UserServiceMapping.create({
      userId,
      city: city || null,
      site: site || null,
      category: category || null,
      canView: canView !== undefined ? canView : true,
      canEdit: canEdit !== undefined ? canEdit : false,
      canDelete: canDelete !== undefined ? canDelete : false,
      canCreate: canCreate !== undefined ? canCreate : false
    });

    // Fetch the created mapping with user details
    const createdMapping = await UserServiceMapping.findByPk(newUserServiceMapping.id, {
      include: [
        {
          model: DashboardUser,
          as: 'user',
          attributes: ['id', 'email', 'isAdmin', 'isSuperAdmin']
        }
      ]
    });
    
    res.status(201).json({
      success: true,
      data: createdMapping,
      message: 'User service mapping created successfully'
    });
  } catch (error) {
    console.error('Error creating user service mapping:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user service mapping',
      error: error.message
    });
  }
};

// Update user service mapping
const updateUserServiceMapping = async (req, res) => {
  try {
    const { id } = req.params;
    const { city, site, category, canView, canEdit, canDelete, canCreate } = req.body;
    
    const userServiceMapping = await UserServiceMapping.findByPk(id, {
      include: [
        {
          model: DashboardUser,
          as: 'user',
          attributes: ['id', 'email', 'isAdmin', 'isSuperAdmin']
        }
      ]
    });
    
    if (!userServiceMapping) {
      return res.status(404).json({
        success: false,
        message: 'User service mapping not found'
      });
    }

    // Check if mapping already exists for this user with same filters (excluding current mapping)
    const existingMapping = await UserServiceMapping.findOne({
      where: {
        userId: userServiceMapping.userId,
        city: city || null,
        site: site || null,
        category: category || null,
        id: { [Op.ne]: id }
      }
    });

    if (existingMapping) {
      return res.status(400).json({
        success: false,
        message: 'Service mapping already exists for this user with the same filters'
      });
    }
    
    await userServiceMapping.update({
      city: city !== undefined ? city : userServiceMapping.city,
      site: site !== undefined ? site : userServiceMapping.site,
      category: category !== undefined ? category : userServiceMapping.category,
      canView: canView !== undefined ? canView : userServiceMapping.canView,
      canEdit: canEdit !== undefined ? canEdit : userServiceMapping.canEdit,
      canDelete: canDelete !== undefined ? canDelete : userServiceMapping.canDelete,
      canCreate: canCreate !== undefined ? canCreate : userServiceMapping.canCreate
    });

    // Fetch updated mapping
    const updatedMapping = await UserServiceMapping.findByPk(id, {
      include: [
        {
          model: DashboardUser,
          as: 'user',
          attributes: ['id', 'email', 'isAdmin', 'isSuperAdmin']
        }
      ]
    });
    
    res.json({
      success: true,
      data: updatedMapping,
      message: 'User service mapping updated successfully'
    });
  } catch (error) {
    console.error('Error updating user service mapping:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user service mapping',
      error: error.message
    });
  }
};

// Delete user service mapping
const deleteUserServiceMapping = async (req, res) => {
  try {
    const { id } = req.params;
    
    const userServiceMapping = await UserServiceMapping.findByPk(id);
    
    if (!userServiceMapping) {
      return res.status(404).json({
        success: false,
        message: 'User service mapping not found'
      });
    }
    
    await userServiceMapping.destroy();
    
    res.json({
      success: true,
      message: 'User service mapping deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user service mapping:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user service mapping',
      error: error.message
    });
  }
};

// Get MqttMacMapping services filtered by user permissions
const getFilteredServices = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user's service mappings
    const userMappings = await UserServiceMapping.findAll({
      where: { userId }
    });

    if (userMappings.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: 'No service mappings found for this user'
      });
    }

    // Build filter conditions
    const whereConditions = [];
    
    userMappings.forEach(mapping => {
      const condition = {};
      
      if (mapping.city) condition.City = mapping.city;
      if (mapping.site) condition.site = mapping.site;
      if (mapping.category) condition.category = mapping.category;
      
      if (Object.keys(condition).length > 0) {
        whereConditions.push(condition);
      }
    });

    // If no specific filters, return all services (if user has view permission)
    const hasViewPermission = userMappings.some(mapping => mapping.canView);
    if (!hasViewPermission) {
      return res.json({
        success: true,
        data: [],
        message: 'User does not have view permissions'
      });
    }

    let services;
    if (whereConditions.length > 0) {
      services = await MqttMacMapping.findAll({
        where: {
          [Op.or]: whereConditions
        },
        order: [['createdAt', 'DESC']]
      });
    } else {
      services = await MqttMacMapping.findAll({
        order: [['createdAt', 'DESC']]
      });
    }

    // Add permission flags to each service
    const servicesWithPermissions = services.map(service => {
      const servicePermissions = {
        canView: false,
        canEdit: false,
        canDelete: false,
        canCreate: false
      };

      userMappings.forEach(mapping => {
        const matchesCity = !mapping.city || mapping.city === service.City;
        const matchesSite = !mapping.site || mapping.site === service.site;
        const matchesCategory = !mapping.category || mapping.category === service.category;

        if (matchesCity && matchesSite && matchesCategory) {
          servicePermissions.canView = servicePermissions.canView || mapping.canView;
          servicePermissions.canEdit = servicePermissions.canEdit || mapping.canEdit;
          servicePermissions.canDelete = servicePermissions.canDelete || mapping.canDelete;
          servicePermissions.canCreate = servicePermissions.canCreate || mapping.canCreate;
        }
      });

      return {
        ...service.toJSON(),
        permissions: servicePermissions
      };
    });

    res.json({
      success: true,
      data: servicesWithPermissions
    });
  } catch (error) {
    console.error('Error fetching filtered services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch filtered services',
      error: error.message
    });
  }
};

module.exports = {
  getAllUserServiceMappings,
  getUserServiceMappingsByUserId,
  getAvailableFilters,
  createUserServiceMapping,
  updateUserServiceMapping,
  deleteUserServiceMapping,
  getFilteredServices
}; 