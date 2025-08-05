'use strict';
module.exports = (sequelize, DataTypes) => {
  const faultReport = sequelize.define('faultReport', {
    userName:DataTypes.STRING,
    machineID:DataTypes.STRING,
    loginLat:DataTypes.STRING,
    loginLong:DataTypes.STRING,
    faultReported:DataTypes.STRING,
    actionTaken:DataTypes.STRING,
    faultStatus:DataTypes.STRING,
  }, {
    tableName: 'faultReport'
  });
  faultReport.associate = function(models) {
    // associations can be defined here
  };
  return faultReport;
};