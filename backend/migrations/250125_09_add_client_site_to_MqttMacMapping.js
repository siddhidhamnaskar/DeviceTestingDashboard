'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('MqttMacMapping', 'client', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
        comment: 'Client for the device'
      });
      await queryInterface.addColumn('MqttMacMapping', 'site', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
        comment: 'Site for the device'
      });
      console.log('Successfully added client and site columns to MqttMacMapping table');
    } catch (error) {
      console.error('Migration failed:', error.message);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('MqttMacMapping', 'client');
      await queryInterface.removeColumn('MqttMacMapping', 'site');
      console.log('Successfully removed client and site columns from MqttMacMapping table');
    } catch (error) {
      console.error('Migration rollback failed:', error.message);
      throw error;
    }
  }
}; 