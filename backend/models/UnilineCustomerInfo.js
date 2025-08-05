'use strict';
module.exports = (sequelize, DataTypes) => {
  const UnilineCustomerInfo = sequelize.define('UnilineCustomerInfo', {
    CustomerName:DataTypes.STRING,
    City:DataTypes.STRING,
    
   
  }, {
    tableName: 'UnilineCustomerInfo'
  });
  UnilineCustomerInfo.associate = function(models) {
    // associations can be defined here
  };
  return UnilineCustomerInfo;
};