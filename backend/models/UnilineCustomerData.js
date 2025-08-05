'use strict';
module.exports = (sequelize, DataTypes) => {
  const UnilineCustomerData = sequelize.define('UnilineCustomerData', {
    CustomerName:DataTypes.STRING,
    CInfo1:DataTypes.STRING,
    CInfo2:DataTypes.STRING,
    CInfo3:DataTypes.STRING,
    CInfo4:DataTypes.STRING,
  

   
  }, {
    tableName: 'UnilineCustomerData'
  });
  UnilineCustomerData.associate = function(models) {
    // associations can be defined here
  };
  return UnilineCustomerData;
};