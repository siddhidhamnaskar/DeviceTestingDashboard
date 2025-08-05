'use strict';
module.exports = (sequelize, DataTypes) => {
  const simulatedvendinglogs = sequelize.define('simulatedvendinglogs', {
    userName : DataTypes.STRING,
    simulatedQty : DataTypes.STRING,
    simulatedCycles : DataTypes.STRING,
    Zones: DataTypes.STRING,
    Wards:DataTypes.STRING,
    Beats:DataTypes.STRING,
  }, {});
  simulatedvendinglogs.associate = function(models) {
    // associations can be defined here
  };
  return simulatedvendinglogs;
};