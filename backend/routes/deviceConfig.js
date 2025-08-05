const express = require('express');
const router = express.Router();
const { 
  saveDeviceConfig, 
  getAllDeviceConfigs, 
  getDeviceConfigById, 
  updateDeviceConfigResponse 
} = require('../controllers/deviceConfig');

// Save device config data
router.post('/', saveDeviceConfig);

// Get all device configs
router.get('/', getAllDeviceConfigs);

// Get device config by ID
router.get('/:id', getDeviceConfigById);

// Update device config response
router.put('/:id/response', updateDeviceConfigResponse);

module.exports = router; 