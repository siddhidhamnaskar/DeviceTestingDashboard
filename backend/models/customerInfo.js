'use strict';
module.exports = (sequelize, DataTypes) => {
  const CustomerInfo = sequelize.define('CustomerInfo', {
    CustomerName:DataTypes.STRING,
    City:DataTypes.STRING,
    
   
  }, {
    tableName: 'CustomerInfo'
  });
  CustomerInfo.associate = function(models) {
    // associations can be defined here
  };
  return CustomerInfo;
};