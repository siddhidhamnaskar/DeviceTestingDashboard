

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('KwikpayMachineStatus', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      MachineNumber:{
        defaultValue: null,
        type: Sequelize.STRING, 
      },
      LastHBT: {
        defaultValue: null,
        type: Sequelize.DATE,
      },
      Status: {
        defaultValue: null,
        type: Sequelize.INTEGER,
      },
      DateTimeOfStatus: {
        defaultValue: null,
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
    down: (queryInterface, Sequelize) => queryInterface.dropTable('KwikpayMachineStatus'),
  };