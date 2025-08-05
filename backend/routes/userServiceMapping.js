const express = require('express');
const router = express.Router();
const {
  getAllUserServiceMappings,
  getUserServiceMappingsByUserId,
  getAvailableFilters,
  createUserServiceMapping,
  updateUserServiceMapping,
  deleteUserServiceMapping,
  getFilteredServices
} = require('../controllers/userServiceMapping');

// Get all user service mappings
router.get('/', getAllUserServiceMappings);

// Get available filters (cities, sites, categories)
router.get('/filters', getAvailableFilters);

// Get user service mappings by user ID
router.get('/user/:userId', getUserServiceMappingsByUserId);

// Get filtered services for a user
router.get('/services/:userId', getFilteredServices);

// Create new user service mapping
router.post('/', createUserServiceMapping);

// Update user service mapping
router.put('/:id', updateUserServiceMapping);

// Delete user service mapping
router.delete('/:id', deleteUserServiceMapping);

module.exports = router; 