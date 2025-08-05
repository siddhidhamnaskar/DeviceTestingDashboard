'use strict';
module.exports = (sequelize, DataTypes) => {
  const hourlyReport = sequelize.define('hourlyReport', {
    machinesTotal:DataTypes.INTEGER,
    machineOnline:DataTypes.INTEGER,
     machineEmpty:DataTypes.INTEGER,
     machineLowStock:DataTypes.INTEGER,
     qtySales:DataTypes.INTEGER,
     cashSales:DataTypes.INTEGER,
     burningSales:DataTypes.INTEGER,
     onTime:DataTypes.INTEGER,
     ward:DataTypes.STRING,
     zone:DataTypes.STRING
   

  }, {
    tableName: 'hourlyReport'
  });
  hourlyReport.associate = function(models) {
    // associations can be defined here
  };
  return hourlyReport;
};