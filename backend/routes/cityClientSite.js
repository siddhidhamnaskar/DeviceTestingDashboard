const express = require('express');
const router = express.Router();
const {
  getAllCityClientSites,
  getCityClientSiteById,
  createCityClientSite,
  updateCityClientSite,
  deleteCityClientSite,
  getUniqueCities,
  getUniqueClients,
  getUniqueSites
} = require('../controllers/cityClientSite');

// Get all city client sites
router.get('/', getAllCityClientSites);

// Get unique cities
router.get('/cities/unique', getUniqueCities);

// Get unique clients
router.get('/clients/unique', getUniqueClients);

// Get unique sites
router.get('/sites/unique', getUniqueSites);

// Get city client site by ID
router.get('/:id', getCityClientSiteById);

// Create new city client site
router.post('/', createCityClientSite);

// Update city client site
router.put('/:id', updateCityClientSite);

// Delete city client site
router.delete('/:id', deleteCityClientSite);

module.exports = router; 