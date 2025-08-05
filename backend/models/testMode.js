'use strict';




module.exports = (sequelize, DataTypes) => {
    const TestMode = sequelize.define(
      'TestMode',
      {
        testMode:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:false
        }
         
         
         
      },
      {
        tableName: 'TestMode'
      }
    
    );
    TestMode.associate = function (models) {
      // associations can be defined here
    };
    return TestMode;
  };