'use strict';



module.exports = (sequelize, DataTypes) => {
    const UnilineTransactions = sequelize.define(
      'UnilineTransactions',
      {
      
        MacID: {
            type: DataTypes.STRING,
      
          },
      
        G1: {
            type: DataTypes.STRING,
          },
          G2: {
            type: DataTypes.STRING,
          },
          G3: {
            type: DataTypes.STRING,
          },
          I: {
            type: DataTypes.STRING,
          },
          Q: {
            type: DataTypes.STRING,
          },
          Q1: {
            type: DataTypes.STRING,
          },
          Q: {
            type: DataTypes.STRING,
          },
          T: {
            type: DataTypes.STRING,
          },
          TL: {
            type: DataTypes.STRING,
          },
          S: {
            type: DataTypes.STRING,
          },
          ST: {
            type: DataTypes.STRING,
          },
          F: {
            type: DataTypes.STRING,
          },
        
          SNoutput:{
            type:DataTypes.STRING,
            
          },
         
         
      },
      {
        tableName: 'UnilineTransactions'
      }
    
    );
    UnilineTransactions.associate = function (models) {
      // associations can be defined here
    };
    return UnilineTransactions;
  };