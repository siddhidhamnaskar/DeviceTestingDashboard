'use strict';
module.exports = (sequelize, DataTypes) => {
  const lockLogs = sequelize.define('lockLogs', {
    userName : DataTypes.STRING,
    machineID : DataTypes.STRING,
    currentLat : DataTypes.STRING,
    currentLong : DataTypes.STRING,
    doorStatus : DataTypes.STRING, 
}, {});
  lockLogs.associate = function(models) {
    // associations can be defined here
  };
  return lockLogs;
};