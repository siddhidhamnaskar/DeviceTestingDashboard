const { UserDeviceMapping, DashboardUser, MqttMacMapping } = require('../models');

// Get all user device mappings with pagination and filtering
const getUserDeviceMappings = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId, deviceId, deviceType } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (userId) whereClause.userId = userId;
    if (deviceId) whereClause.deviceId = deviceId;
    if (deviceType) whereClause.deviceType = deviceType;

    const { count, rows } = await UserDeviceMapping.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: DashboardUser,
          as: 'user',
          attributes: ['id', 'email']
        },
        {
          model: MqttMacMapping,
          as: 'device',
          attributes: ['id', 'MacID', 'UID', 'Location', 'City']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user device mappings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user device mappings',
      error: error.message
    });
  }
};

// Get user device mappings for a specific user
const getUserDeviceMappingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const mappings = await UserDeviceMapping.findAll({
      where: { userId },
      include: [
        {
          model: MqttMacMapping,
          as: 'device',
          attributes: ['id', 'MacID', 'UID', 'Location', 'City', 'SocketNumber']
        }
      ],
      order: [['isPrimary', 'DESC'], ['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: mappings
    });
  } catch (error) {
    console.error('Error fetching user device mappings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user device mappings',
      error: error.message
    });
  }
};

// Get available devices for linking
const getAvailableDevices = async (req, res) => {
  try {
    const { userId, deviceType = 'mqtt' } = req.query;

    // Get devices that are not already linked to this user
    let whereClause = {};
    if (deviceType === 'mqtt') {
      whereClause = {
        id: {
          [require('sequelize').Op.notIn]: require('sequelize').literal(
            `(SELECT deviceId FROM UserDeviceMappings WHERE userId = ${userId || 0} AND deviceType = 'mqtt')`
          )
        }
      };
    }

    const devices = await MqttMacMapping.findAll({
      where: whereClause,
      attributes: ['id', 'MacID', 'UID', 'Location', 'City', 'SocketNumber'],
      limit: 100,
      order: [['MacID', 'ASC']]
    });

    res.json({
      success: true,
      data: devices
    });
  } catch (error) {
    console.error('Error fetching available devices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available devices',
      error: error.message
    });
  }
};

// Create a new user device mapping
const createUserDeviceMapping = async (req, res) => {
  try {
    const {
      userId,
      deviceId,
      deviceType = 'mqtt',
      canView = true,
      canControl = false,
      canConfigure = false,
      isPrimary = false,
      notes
    } = req.body;

    // Validate required fields
    if (!userId || !deviceId) {
      return res.status(400).json({
        success: false,
        message: 'User ID and Device ID are required'
      });
    }

    // Check if mapping already exists
    const existingMapping = await UserDeviceMapping.findOne({
      where: { userId, deviceId, deviceType }
    });

    if (existingMapping) {
      return res.status(400).json({
        success: false,
        message: 'Device is already linked to this user'
      });
    }

    // If this is set as primary, unset other primary devices for this user
    if (isPrimary) {
      await UserDeviceMapping.update(
        { isPrimary: false },
        { where: { userId, deviceType } }
      );
    }

    const mapping = await UserDeviceMapping.create({
      userId,
      deviceId,
      deviceType,
      canView,
      canControl,
      canConfigure,
      isPrimary,
      notes
    });

    // Fetch the created mapping with associations
    const createdMapping = await UserDeviceMapping.findByPk(mapping.id, {
      include: [
        {
          model: DashboardUser,
          as: 'user',
          attributes: ['id', 'email']
        },
        {
          model: MqttMacMapping,
          as: 'device',
          attributes: ['id', 'MacID', 'UID', 'Location', 'City']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Device linked successfully',
      data: createdMapping
    });
  } catch (error) {
    console.error('Error creating user device mapping:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to link device to user',
      error: error.message
    });
  }
};

// Update a user device mapping
const updateUserDeviceMapping = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      canView,
      canControl,
      canConfigure,
      isPrimary,
      notes
    } = req.body;

    const mapping = await UserDeviceMapping.findByPk(id);
    if (!mapping) {
      return res.status(404).json({
        success: false,
        message: 'User device mapping not found'
      });
    }

    // If this is set as primary, unset other primary devices for this user
    if (isPrimary && !mapping.isPrimary) {
      await UserDeviceMapping.update(
        { isPrimary: false },
        { where: { userId: mapping.userId, deviceType: mapping.deviceType } }
      );
    }

    await mapping.update({
      canView,
      canControl,
      canConfigure,
      isPrimary,
      notes
    });

    // Fetch the updated mapping with associations
    const updatedMapping = await UserDeviceMapping.findByPk(id, {
      include: [
        {
          model: DashboardUser,
          as: 'user',
          attributes: ['id', 'email']
        },
        {
          model: MqttMacMapping,
          as: 'device',
          attributes: ['id', 'MacID', 'UID', 'Location', 'City']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Device mapping updated successfully',
      data: updatedMapping
    });
  } catch (error) {
    console.error('Error updating user device mapping:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update device mapping',
      error: error.message
    });
  }
};

// Delete a user device mapping
const deleteUserDeviceMapping = async (req, res) => {
  try {
    const { id } = req.params;

    const mapping = await UserDeviceMapping.findByPk(id);
    if (!mapping) {
      return res.status(404).json({
        success: false,
        message: 'User device mapping not found'
      });
    }

    await mapping.destroy();

    res.json({
      success: true,
      message: 'Device unlinked successfully'
    });
  } catch (error) {
    console.error('Error deleting user device mapping:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unlink device',
      error: error.message
    });
  }
};

// Bulk link devices to a user
const bulkLinkDevices = async (req, res) => {
  try {
    const { userId, deviceIds, deviceType = 'mqtt', permissions = {} } = req.body;

    if (!userId || !deviceIds || !Array.isArray(deviceIds)) {
      return res.status(400).json({
        success: false,
        message: 'User ID and device IDs array are required'
      });
    }

    const { canView = true, canControl = false, canConfigure = false } = permissions;

    // Check for existing mappings
    const existingMappings = await UserDeviceMapping.findAll({
      where: {
        userId,
        deviceId: deviceIds,
        deviceType
      }
    });

    const existingDeviceIds = existingMappings.map(m => m.deviceId);
    const newDeviceIds = deviceIds.filter(id => !existingDeviceIds.includes(id));

    if (newDeviceIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'All devices are already linked to this user'
      });
    }

    // Create new mappings
    const mappings = await UserDeviceMapping.bulkCreate(
      newDeviceIds.map(deviceId => ({
        userId,
        deviceId,
        deviceType,
        canView,
        canControl,
        canConfigure,
        isPrimary: false
      }))
    );

    res.status(201).json({
      success: true,
      message: `${mappings.length} devices linked successfully`,
      data: {
        linked: mappings.length,
        alreadyLinked: existingDeviceIds.length,
        total: deviceIds.length
      }
    });
  } catch (error) {
    console.error('Error bulk linking devices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bulk link devices',
      error: error.message
    });
  }
};

module.exports = {
  getUserDeviceMappings,
  getUserDeviceMappingsByUser,
  getAvailableDevices,
  createUserDeviceMapping,
  updateUserDeviceMapping,
  deleteUserDeviceMapping,
  bulkLinkDevices
}; 