const { DeviceConfig } = require('../models');

// Save device config data
const saveDeviceConfig = async (req, res) => {
  try {
    const { UserName, EmailId, MacId, MachineId, Command, Response } = req.body;

    // Validate required fields
    if (!UserName || !EmailId || !MacId || !MachineId || !Command) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'UserName, EmailId, MacId, MachineId, and Command are required'
      });
    }

    // Create new device config record
    const deviceConfig = await DeviceConfig.create({
      UserName,
      EmailId,
      MacId,
      MachineId,
      Command,
      Response,
      date: new Date()
    });

    return res.status(201).json({
      success: true,
      message: 'Device config saved successfully',
      data: deviceConfig
    });

  } catch (error) {
    console.error('Error saving device config:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to save device config'
    });
  }
};

// Get all device configs
const getAllDeviceConfigs = async (req, res) => {
  try {
    const deviceConfigs = await DeviceConfig.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      data: deviceConfigs
    });
  } catch (error) {
    console.error('Error fetching device configs:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch device configs'
    });
  }
};

// Get device config by ID
const getDeviceConfigById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deviceConfig = await DeviceConfig.findByPk(id);
    
    if (!deviceConfig) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Device config not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: deviceConfig
    });
  } catch (error) {
    console.error('Error fetching device config:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch device config'
    });
  }
};

// Update device config response
const updateDeviceConfigResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { Response } = req.body;

    if (!Response) {
      return res.status(400).json({
        error: 'Missing required field',
        message: 'Response is required'
      });
    }

    const deviceConfig = await DeviceConfig.findByPk(id);
    
    if (!deviceConfig) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Device config not found'
      });
    }

    await deviceConfig.update({ Response });

    return res.status(200).json({
      success: true,
      message: 'Device config response updated successfully',
      data: deviceConfig
    });

  } catch (error) {
    console.error('Error updating device config response:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update device config response'
    });
  }
};

module.exports = {
  saveDeviceConfig,
  getAllDeviceConfigs,
  getDeviceConfigById,
  updateDeviceConfigResponse
}; 