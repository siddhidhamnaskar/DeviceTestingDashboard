'use strict';
module.exports = (sequelize, DataTypes) => {
  const TrafficLightColors = sequelize.define('TrafficLightColors', {
    Junction:DataTypes.STRING,
    R1:DataTypes.STRING,
    R2:DataTypes.STRING,
    R3:DataTypes.STRING,
    R4:DataTypes.STRING,
    lastHeartBeatTime:DataTypes.DATE

   
  }, {
    tableName: 'TrafficLightColors'
  });
  TrafficLightColors.associate = function(models) {
    // associations can be defined here
  };
  return TrafficLightColors;
};