'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Add isAdmin column
      await queryInterface.addColumn('MqttDashboardUsers', 'isAdmin', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether the user has admin privileges'
      });

      // Add isSuperAdmin column
      await queryInterface.addColumn('MqttDashboardUsers', 'isSuperAdmin', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether the user has super admin privileges'
      });

      console.log('Successfully added isAdmin and isSuperAdmin columns to MqttDashboardUsers table');
    } catch (error) {
      console.error('Migration failed:', error.message);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Remove isSuperAdmin column
      await queryInterface.removeColumn('MqttDashboardUsers', 'isSuperAdmin');
      
      // Remove isAdmin column
      await queryInterface.removeColumn('MqttDashboardUsers', 'isAdmin');
      
      console.log('Successfully removed isAdmin and isSuperAdmin columns from MqttDashboardUsers table');
    } catch (error) {
      console.error('Migration rollback failed:', error.message);
      throw error;
    }
  }
}; 