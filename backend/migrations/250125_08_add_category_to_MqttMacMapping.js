'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Add category column to MqttMacMapping table
      await queryInterface.addColumn('MqttMacMapping', 'category', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
        comment: 'Category classification for the device'
      });

      console.log('Successfully added category column to MqttMacMapping table');
    } catch (error) {
      console.error('Migration failed:', error.message);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Remove category column from MqttMacMapping table
      await queryInterface.removeColumn('MqttMacMapping', 'category');
      console.log('Successfully removed category column from MqttMacMapping table');
    } catch (error) {
      console.error('Migration rollback failed:', error.message);
      throw error;
    }
  }
}; 