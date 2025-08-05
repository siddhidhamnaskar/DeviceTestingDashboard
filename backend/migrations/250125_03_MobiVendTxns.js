module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('MobiVendTxns', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    qrCodeId: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    serial: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    txnId: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    txnType: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    amount: {
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('MobiVendTxns'),
}; 