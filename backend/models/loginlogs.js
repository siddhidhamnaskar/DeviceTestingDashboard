'use strict';
module.exports = (sequelize, DataTypes) => {
  const loginLogs = sequelize.define('loginLogs', {
    userName : DataTypes.STRING,
    loginLat : DataTypes.STRING,
    loginLong : DataTypes.STRING,
    LoggedInTill: DataTypes.DATE,
    deviceModel:DataTypes.STRING,
    Remark:DataTypes.STRING,
    MachineNumber:DataTypes.STRING

  }, {});
  loginLogs.associate = function(models) {
    // associations can be defined here
  };
  return loginLogs;
};