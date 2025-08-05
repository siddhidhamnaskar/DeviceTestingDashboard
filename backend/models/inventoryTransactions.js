'use strict';
module.exports = (sequelize, DataTypes) => {
  const InventoryTransactions = sequelize.define('InventoryTransactions', {
    From:DataTypes.STRING,
    To:DataTypes.STRING,
    QtyDelivered:DataTypes.INTEGER,
    CashReceived:DataTypes.STRING,
    Remark:DataTypes.STRING

  }, {
    tableName: 'InventoryTransactions'
  });
  InventoryTransactions.associate = function(models) {
    // associations can be defined here
  };
  return InventoryTransactions;
};