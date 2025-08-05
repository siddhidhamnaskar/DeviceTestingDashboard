'use strict';
module.exports = (sequelize, DataTypes) => {
  const totalInventory = sequelize.define('totalInventory', {
    UserName:DataTypes.STRING,
    TotalQty:DataTypes.STRING,
    TotalCash:DataTypes.STRING,

  }, {
    tableName: 'totalInventory'
  });
  totalInventory.associate = function(models) {
    // associations can be defined here
  };
  return totalInventory;
};