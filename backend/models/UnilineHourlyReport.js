'use strict';
module.exports = (sequelize, DataTypes) => {
  const UnilineHourlyReport = sequelize.define('UnilineHourlyReport', {
    deviceTotal:DataTypes.INTEGER,
    deviceOnline:DataTypes.INTEGER,
    inverterTotal:DataTypes.INTEGER,
    inverterOnline:DataTypes.INTEGER,
     BatteryShutDown:DataTypes.INTEGER,
     BatteryLow:DataTypes.INTEGER,
     onTime:DataTypes.INTEGER,
     ward:DataTypes.STRING,
     zone:DataTypes.STRING
   

  }, {
    tableName: 'UnilineHourlyReport'
  });
  UnilineHourlyReport.associate = function(models) {
    // associations can be defined here
  };
  return UnilineHourlyReport;
};