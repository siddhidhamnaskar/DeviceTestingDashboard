'use strict';
module.exports = (sequelize, DataTypes) => {
  const SerialPort = sequelize.define('SerialPort', {
   
     value1:DataTypes.STRING,
     value2:DataTypes.STRING,
     value3:DataTypes.STRING,
     value4:DataTypes.STRING,
     value5:DataTypes.STRING,
     value6:DataTypes.STRING,

  }, {
    tableName: 'SerialPort'
  });
  SerialPort.associate = function(models) {
    // associations can be defined here
  };
  return SerialPort;
};