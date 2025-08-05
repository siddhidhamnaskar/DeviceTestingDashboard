'use strict';
module.exports = (sequelize, DataTypes) => {
  const KwikNetPwFailReport = sequelize.define('KwikNetPwFailReport', {
    deviceId: DataTypes.STRING,
    NetworkFailPeriod: DataTypes.STRING,
    PowerFailPeriod: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
     tableName: 'KwikNetPwFailReport'
  });
  KwikNetPwFailReport.associate = function(models) {
    // associations can be defined here
  };
  return KwikNetPwFailReport;
};
