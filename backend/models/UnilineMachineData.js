'use strict';



module.exports = (sequelize, DataTypes) => {
    const UnilineMachineData = sequelize.define(
      'UnilineMachineData',
      {
        UID: {
            type: DataTypes.STRING,
      
          },
        MacID: {
            type: DataTypes.STRING,
      
          },
          Location: {
            type: DataTypes.STRING,
      
          },

          City: {
            type: DataTypes.STRING,
      
          },
          Zone: {
            type: DataTypes.STRING,
      
          },
          Ward: {
            type: DataTypes.STRING,
      
          },
          Beat: {
            type: DataTypes.STRING,
      
          },
        SocketNumber: {
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
         
          lastHeartBeatTime:{
            type:DataTypes.DATE,
            allowNull:false
          },
        
          SNoutput:{
            type:DataTypes.STRING,
            
          },
         
         
      },
      {
        tableName: 'UnilineMachineData'
      }
    
    );
    UnilineMachineData.associate = function (models) {
      // associations can be defined here
    };
    return UnilineMachineData;
  };