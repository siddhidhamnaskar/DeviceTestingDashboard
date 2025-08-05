'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('MacMapping', 'SSID2output', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('MacMapping', 'PWD2output', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('MacMapping', 'SSID2output');
    await queryInterface.removeColumn('MacMapping', 'PWD2output');
  }
};
