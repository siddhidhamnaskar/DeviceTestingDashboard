'use strict';
module.exports = (sequelize, DataTypes) => {
  const UnilineLoginLogs = sequelize.define('UnilineLoginLogs', {
    userName : DataTypes.STRING,
    loginLat : DataTypes.STRING,
    loginLong : DataTypes.STRING,
    LoggedInTill: DataTypes.DATE,
    deviceModel:DataTypes.STRING,
    Remark:DataTypes.STRING,
    

  }, {});
  UnilineLoginLogs.associate = function(models) {
    // associations can be defined here
  };
  return UnilineLoginLogs;
};