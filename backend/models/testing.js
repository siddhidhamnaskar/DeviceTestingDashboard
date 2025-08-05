'use strict';
module.exports = (sequelize, DataTypes) => {
  const Testing=sequelize.define('Testing', {
    device_number: {
       
        type: DataTypes.STRING,
      },
      command:{
        type: DataTypes.STRING,
      },
      expected_output:{
        type: DataTypes.STRING,
      },
      actual_outtput:{
        type: DataTypes.STRING,
      },
      result:{
        type: DataTypes.STRING,
      },
      time_gap:{
        type: DataTypes.STRING,
      },

   
  }, {
    tableName: 'Testing'
  });
  Testing.associate = function(models) {
    // associations can be defined here
  };
  return Testing;
};