'use strict';
module.exports = (sequelize, DataTypes) => {
  const SSNReport = sequelize.define('SSNReport', {
    userName:DataTypes.STRING,
    machineID:DataTypes.STRING,
    newMachineID:DataTypes.STRING,
    dailyCount:DataTypes.INTEGER,
    totalCount:DataTypes.INTEGER

}, {
    tableName: 'SSNReport'
  });
  SSNReport.associate = function(models) {
    // associations can be defined here
  };
  return SSNReport;
};