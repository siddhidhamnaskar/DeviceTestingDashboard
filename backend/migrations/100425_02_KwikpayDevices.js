

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('KwikpayDevices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      MacId:{
        defaultValue: null,
        type: Sequelize.STRING, 
      },
      SerialNumber:{
        defaultValue: null,
        type: Sequelize.STRING, 
      },
      lastHeartBeat: {
        allowNull: false,
        type: Sequelize.DATE,
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
    down: (queryInterface, Sequelize) => queryInterface.dropTable('KwikpayDevices'),
  };