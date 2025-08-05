

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('KwikpayTXN', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      deviceId:{
        defaultValue: null,
        type: Sequelize.STRING, 
      },
      TCResponse: {
        defaultValue: null,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }),
    down: (queryInterface, Sequelize) => queryInterface.dropTable('KwikpayTXN'),
  };