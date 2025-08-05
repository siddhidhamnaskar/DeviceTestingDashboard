const express = require('express');
const router = express.Router();
const {
  getAllDashboardUsers,
  getDashboardUserById,
  createDashboardUser,
  updateDashboardUser,
  deleteDashboardUser
} = require('../controllers/dashboardUser');

// Get all dashboard users
router.get('/', getAllDashboardUsers);

// Get dashboard user by ID
router.get('/:id', getDashboardUserById);

// Create new dashboard user
router.post('/', createDashboardUser);

// Update dashboard user
router.put('/:id', updateDashboardUser);

// Delete dashboard user
router.delete('/:id', deleteDashboardUser);

module.exports = router; 