module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('MobiVendTxns', 'VendingStatus', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'amount'
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('MobiVendTxns', 'VendingStatus');
  }
}; 