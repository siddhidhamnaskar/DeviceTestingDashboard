'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.createTable('MobiVendDevices', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        serial: {
          type: Sequelize.STRING,
          allowNull: false
        },
        merchantId: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        category: {
          type: Sequelize.STRING,
          allowNull: true,
          comment: 'Category classification for the device'
        },
        Coint_Acceptor_Type: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 2,
          comment: 'Type of coin acceptor for the device'
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

      // Add unique index for merchantId
      await queryInterface.addIndex('MobiVendDevices', ['merchantId'], {
        unique: true,
        name: 'unique_merchantId'
      });

      console.log('Successfully created MobiVendDevices table');
    } catch (error) {
      console.error('Migration failed:', error.message);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.dropTable('MobiVendDevices');
      console.log('Successfully dropped MobiVendDevices table');
    } catch (error) {
      console.error('Migration rollback failed:', error.message);
      throw error;
    }
  }
};
