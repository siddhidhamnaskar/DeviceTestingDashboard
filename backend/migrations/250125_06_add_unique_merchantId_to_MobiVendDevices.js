'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // First, check if there are any duplicate merchant IDs
      const duplicates = await queryInterface.sequelize.query(`
        SELECT merchantId, COUNT(*) as count
        FROM MobiVendDevices
        WHERE merchantId IS NOT NULL
        GROUP BY merchantId
        HAVING COUNT(*) > 1
      `);

      if (duplicates[0].length > 0) {
        console.log('Found duplicate merchant IDs:', duplicates[0]);
        throw new Error('Cannot add unique constraint: duplicate merchant IDs exist in the database. Please resolve duplicates first.');
      }

      // Add unique constraint to merchantId column
      await queryInterface.addConstraint('MobiVendDevices', {
        fields: ['merchantId'],
        type: 'unique',
        name: 'unique_merchantId'
      });

      console.log('Successfully added unique constraint to merchantId column');
    } catch (error) {
      console.error('Migration failed:', error.message);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Remove unique constraint from merchantId column
      await queryInterface.removeConstraint('MobiVendDevices', 'unique_merchantId');
      console.log('Successfully removed unique constraint from merchantId column');
    } catch (error) {
      console.error('Migration rollback failed:', error.message);
      throw error;
    }
  }
}; 