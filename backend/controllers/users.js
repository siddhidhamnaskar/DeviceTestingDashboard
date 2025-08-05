const { DashboardUser } = require('../models');

const getAllUsers = async (req, res) => {
  try {
    const users = await DashboardUser.findAll({
      attributes: ['id', 'email', 'createdAt', 'updatedAt']
    });
    
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch users'
    });
  }
};

module.exports = {
  getAllUsers
};
