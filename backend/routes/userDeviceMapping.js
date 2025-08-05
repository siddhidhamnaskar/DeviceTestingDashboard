const express = require('express');
const router = express.Router();
const {
  getUserDeviceMappings,
  getUserDeviceMappingsByUser,
  getAvailableDevices,
  createUserDeviceMapping,
  updateUserDeviceMapping,
  deleteUserDeviceMapping,
  bulkLinkDevices
} = require('../controllers/userDeviceMapping');

// Get all user device mappings with pagination and filtering
router.get('/', getUserDeviceMappings);

// Get user device mappings for a specific user
router.get('/user/:userId', getUserDeviceMappingsByUser);

// Get available devices for linking
router.get('/available-devices', getAvailableDevices);

// Create a new user device mapping
router.post('/', createUserDeviceMapping);

// Update a user device mapping
router.put('/:id', updateUserDeviceMapping);

// Delete a user device mapping
router.delete('/:id', deleteUserDeviceMapping);

// Bulk link devices to a user
router.post('/bulk-link', bulkLinkDevices);

module.exports = router; 