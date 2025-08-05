'use strict';
module.exports = (sequelize, DataTypes) => {
  const CommandOutputs = sequelize.define('CommandOutputs', {
    comand:DataTypes.STRING,
    output:DataTypes.STRING,
   

   
  }, {
    tableName: 'CommandOutputs'
  });
  CommandOutputs.associate = function(models) {
    // associations can be defined here
  };
  return CommandOutputs;
};