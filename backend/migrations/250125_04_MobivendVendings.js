module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('MobivendVendings', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    serial: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    txnId: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    SID: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    price: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    spiralNumber: {
      type: Sequelize.STRING,
      allowNull: true,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('MobivendVendings'),
}; 