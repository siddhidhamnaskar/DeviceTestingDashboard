

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('KwikpayTesting', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      device_number:{
        defaultValue: null,
        type: Sequelize.STRING, 
      },
        command:{
        defaultValue: null,
        type: Sequelize.STRING, 
      },
        expected_output:{
        defaultValue: null,
        type: Sequelize.STRING, 
      },
         actual_outtput:{
        defaultValue: null,
        type: Sequelize.STRING, 
      },
        result:{
        defaultValue: null,
        type: Sequelize.STRING, 
      },
        time_gap:{
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
    down: (queryInterface, Sequelize) => queryInterface.dropTable('KwikpayTesting'),
  };