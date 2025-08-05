'use strict';
module.exports = (sequelize, DataTypes) => {
  const PaytmPayments = sequelize.define('PaytmPayments', {
     mid:DataTypes.STRING,
     amt:DataTypes.STRING,
     custID:DataTypes.STRING,
     orderID:DataTypes.STRING,
     mobNumber:DataTypes.STRING,
     txnID:DataTypes.STRING

  }, {
    tableName: 'PaytmPayments',
  });
  PaytmPayments.associate = function(models) {
    // associations can be defined here
  };
  return PaytmPayments;
};