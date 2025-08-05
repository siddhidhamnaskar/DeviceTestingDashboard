const { CityClientSite } = require('../models');
const { Sequelize } = require('sequelize');

// Get all city client sites
const getAllCityClientSites = async (req, res) => {
  try {
    const cityClientSites = await CityClientSite.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: cityClientSites
    });
  } catch (error) {
    console.error('Error fetching city client sites:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch city client sites',
      error: error.message
    });
  }
};

// Get unique cities
const getUniqueCities = async (req, res) => {
  try {
    const cities = await CityClientSite.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('city')), 'city']],
      order: [['city', 'ASC']]
    });
    
    const uniqueCities = cities.map(item => item.getDataValue('city')).filter(city => city);
    
    res.json({
      success: true,
      data: uniqueCities
    });
  } catch (error) {
    console.error('Error fetching unique cities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unique cities',
      error: error.message
    });
  }
};

// Get unique clients
const getUniqueClients = async (req, res) => {
  try {
    const clients = await CityClientSite.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('client')), 'client']],
      order: [['client', 'ASC']]
    });
    
    const uniqueClients = clients.map(item => item.getDataValue('client')).filter(client => client);
    
    res.json({
      success: true,
      data: uniqueClients
    });
  } catch (error) {
    console.error('Error fetching unique clients:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unique clients',
      error: error.message
    });
  }
};

// Get unique sites
const getUniqueSites = async (req, res) => {
  try {
    const sites = await CityClientSite.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('site')), 'site']],
      order: [['site', 'ASC']]
    });
    
    const uniqueSites = sites.map(item => item.getDataValue('site')).filter(site => site);
    
    res.json({
      success: true,
      data: uniqueSites
    });
  } catch (error) {
    console.error('Error fetching unique sites:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unique sites',
      error: error.message
    });
  }
};

// Get city client site by ID
const getCityClientSiteById = async (req, res) => {
  try {
    const { id } = req.params;
    const cityClientSite = await CityClientSite.findByPk(id);
    
    if (!cityClientSite) {
      return res.status(404).json({
        success: false,
        message: 'City client site not found'
      });
    }
    
    res.json({
      success: true,
      data: cityClientSite
    });
  } catch (error) {
    console.error('Error fetching city client site:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch city client site',
      error: error.message
    });
  }
};

// Create new city client site
const createCityClientSite = async (req, res) => {
  try {
    const { city, client, site, deviceType } = req.body;
    
    // Validate required fields
    if (!city || !client || !site || !deviceType) {
      return res.status(400).json({
        success: false,
        message: 'All fields (city, client, site, deviceType) are required'
      });
    }
    
    const newCityClientSite = await CityClientSite.create({
      city,
      client,
      site,
      deviceType
    });
    
    res.status(201).json({
      success: true,
      data: newCityClientSite,
      message: 'City client site created successfully'
    });
  } catch (error) {
    console.error('Error creating city client site:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create city client site',
      error: error.message
    });
  }
};

// Update city client site
const updateCityClientSite = async (req, res) => {
  try {
    const { id } = req.params;
    const { city, client, site, deviceType } = req.body;
    
    const cityClientSite = await CityClientSite.findByPk(id);
    
    if (!cityClientSite) {
      return res.status(404).json({
        success: false,
        message: 'City client site not found'
      });
    }
    
    // Validate required fields
    if (!city || !client || !site || !deviceType) {
      return res.status(400).json({
        success: false,
        message: 'All fields (city, client, site, deviceType) are required'
      });
    }
    
    await cityClientSite.update({
      city,
      client,
      site,
      deviceType
    });
    
    res.json({
      success: true,
      data: cityClientSite,
      message: 'City client site updated successfully'
    });
  } catch (error) {
    console.error('Error updating city client site:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update city client site',
      error: error.message
    });
  }
};

// Delete city client site
const deleteCityClientSite = async (req, res) => {
  try {
    const { id } = req.params;
    
    const cityClientSite = await CityClientSite.findByPk(id);
    
    if (!cityClientSite) {
      return res.status(404).json({
        success: false,
        message: 'City client site not found'
      });
    }
    
    await cityClientSite.destroy();
    
    res.json({
      success: true,
      message: 'City client site deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting city client site:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete city client site',
      error: error.message
    });
  }
};

module.exports = {
  getAllCityClientSites,
  getCityClientSiteById,
  createCityClientSite,
  updateCityClientSite,
  deleteCityClientSite,
  getUniqueCities,
  getUniqueClients,
  getUniqueSites
}; 