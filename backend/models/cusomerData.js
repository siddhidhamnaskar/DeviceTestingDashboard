'use strict';
module.exports = (sequelize, DataTypes) => {
  const CustomerData = sequelize.define('CustomerData', {
    CustomerName:DataTypes.STRING,
    CInfo1:DataTypes.STRING,
    CInfo2:DataTypes.STRING,
    CInfo3:DataTypes.STRING,
    CInfo4:DataTypes.STRING,
    MachineType:DataTypes.STRING,

   
  }, {
    tableName: 'CustomerData'
  });
  CustomerData.associate = function(models) {
    // associations can be defined here
  };
  return CustomerData;
};