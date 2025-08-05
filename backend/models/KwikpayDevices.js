'use strict';
module.exports = (sequelize, DataTypes) => {
  const KwikpayDevices = sequelize.define('KwikpayDevices', {
    MacId: DataTypes.STRING,
    SerialNumber: DataTypes.STRING,
    lastHeartBeat: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
     tableName: 'KwikpayDevices'
  });
  KwikpayDevices.associate = function(models) {
    // associations can be defined here
  };
  return KwikpayDevices;
};
