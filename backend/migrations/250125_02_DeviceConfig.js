'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DeviceConfig', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      EmailId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      MacId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      MachineId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Command: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      Response: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('DeviceConfig');
  }
}; 