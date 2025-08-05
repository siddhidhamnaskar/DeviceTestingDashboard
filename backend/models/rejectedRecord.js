'use strict';
module.exports = (sequelize, DataTypes) => {
  const RejectedRecord = sequelize.define('RejectedRecord', {
    machineId: DataTypes.INTEGER,
    qtyOld: DataTypes.INTEGER,
    qtyNew: DataTypes.INTEGER,
    cashOld: DataTypes.INTEGER,
    cashNew: DataTypes.INTEGER,
  }, {
    tableName: 'RejectedRecords'
  });
  RejectedRecord.associate = function(models) {
    // associations can be defined here
  };
  return RejectedRecord;
};