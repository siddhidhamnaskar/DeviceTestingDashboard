'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Add Coint_Acceptor_Type column to MobiVendDevices table
      await queryInterface.addColumn('MobiVendDevices', 'Coint_Acceptor_Type', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2,
        comment: 'Type of coin acceptor for the device'
      });

      console.log('Successfully added Coint_Acceptor_Type column to MobiVendDevices table');
    } catch (error) {
      console.error('Migration failed:', error.message);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Remove Coint_Acceptor_Type column from MobiVendDevices table
      await queryInterface.removeColumn('MobiVendDevices', 'Coint_Acceptor_Type');
      console.log('Successfully removed Coint_Acceptor_Type column from MobiVendDevices table');
    } catch (error) {
      console.error('Migration rollback failed:', error.message);
      throw error;
    }
  }
}; 