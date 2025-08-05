'use strict';
module.exports = (sequelize, DataTypes) => {
  const KwikpayTXN = sequelize.define('KwikpayTXN', {
    deviceId: DataTypes.STRING,
    TCResponse: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
     tableName: 'KwikpayTXN'
  });
  KwikpayTXN.associate = function(models) {
    // associations can be defined here
  };
  return KwikpayTXN;
};
