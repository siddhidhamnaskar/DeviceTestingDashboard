const { DashboardUser } = require('../models');

// Get all dashboard users
const getAllDashboardUsers = async (req, res) => {
  try {
    const dashboardUsers = await DashboardUser.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: dashboardUsers
    });
  } catch (error) {
    console.error('Error fetching dashboard users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard users',
      error: error.message
    });
  }
};

// Get dashboard user by ID
const getDashboardUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const dashboardUser = await DashboardUser.findByPk(id);
    
    if (!dashboardUser) {
      return res.status(404).json({
        success: false,
        message: 'Dashboard user not found'
      });
    }
    
    res.json({
      success: true,
      data: dashboardUser
    });
  } catch (error) {
    console.error('Error fetching dashboard user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard user',
      error: error.message
    });
  }
};

// Create new dashboard user
const createDashboardUser = async (req, res) => {
  try {
    const { email, isAdmin, isSuperAdmin } = req.body;
    
    // Validate required fields
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }
    
    // Check if email already exists
    const existingUser = await DashboardUser.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    const newDashboardUser = await DashboardUser.create({
      email,
      isAdmin: isAdmin || false,
      isSuperAdmin: isSuperAdmin || false
    });
    
    res.status(201).json({
      success: true,
      data: newDashboardUser,
      message: 'Dashboard user created successfully'
    });
  } catch (error) {
    console.error('Error creating dashboard user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create dashboard user',
      error: error.message
    });
  }
};

// Update dashboard user
const updateDashboardUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, isAdmin, isSuperAdmin } = req.body;
    
    const dashboardUser = await DashboardUser.findByPk(id);
    
    if (!dashboardUser) {
      return res.status(404).json({
        success: false,
        message: 'Dashboard user not found'
      });
    }
    
    // Validate required fields
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }
    
    // Check if email already exists for another user
    const existingUser = await DashboardUser.findOne({ 
      where: { 
        email,
        id: { [require('sequelize').Op.ne]: id }
      }
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    await dashboardUser.update({
      email,
      isAdmin: isAdmin !== undefined ? isAdmin : dashboardUser.isAdmin,
      isSuperAdmin: isSuperAdmin !== undefined ? isSuperAdmin : dashboardUser.isSuperAdmin
    });
    
    res.json({
      success: true,
      data: dashboardUser,
      message: 'Dashboard user updated successfully'
    });
  } catch (error) {
    console.error('Error updating dashboard user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update dashboard user',
      error: error.message
    });
  }
};

// Delete dashboard user
const deleteDashboardUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const dashboardUser = await DashboardUser.findByPk(id);
    
    if (!dashboardUser) {
      return res.status(404).json({
        success: false,
        message: 'Dashboard user not found'
      });
    }
    
    await dashboardUser.destroy();
    
    res.json({
      success: true,
      message: 'Dashboard user deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting dashboard user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete dashboard user',
      error: error.message
    });
  }
};

module.exports = {
  getAllDashboardUsers,
  getDashboardUserById,
  createDashboardUser,
  updateDashboardUser,
  deleteDashboardUser
}; 