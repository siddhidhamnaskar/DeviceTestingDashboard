'use strict';
module.exports = (sequelize, DataTypes) => {
  const KwikpayMachineStatus = sequelize.define('KwikpayMachineStatus', {
  
    MachineNumber: DataTypes.STRING,
    LastHBT: DataTypes.DATE,
    Status: DataTypes.NUMBER,
    DateTimeOfStatus: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
     tableName: 'KwikpayMachineStatus'
  });
  KwikpayMachineStatus.associate = function(models) {
    // associations can be defined here
  };
  return KwikpayMachineStatus;
};
