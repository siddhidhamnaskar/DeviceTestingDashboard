'use strict';



module.exports = (sequelize, DataTypes) => {
    const UnilineMacMapping = sequelize.define(
      'UnilineMacMapping',
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
          adress: {
            type: DataTypes.STRING,
      
          },
          lat: {
            type: DataTypes.STRING,
      
          },
          lon: {
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
          GF: {
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
          BatteryVoltage:{
            type:DataTypes.STRING,
          },
          BatteryCapacity:{
            type:DataTypes.STRING,
          },
          IpVoltage1:{
            type:DataTypes.STRING,
          },
          IpVoltage2:{
            type:DataTypes.STRING,
          },
          IpVoltage3:{
            type:DataTypes.STRING,
          },
          OpVoltage1:{
            type:DataTypes.STRING,
          },
          OpVoltage2:{
            type:DataTypes.STRING,
          },
          OpVoltage3:{
            type:DataTypes.STRING,
          },
          IpFrequency:{
            type:DataTypes.STRING,
          },
          OpFrequency:{
            type:DataTypes.STRING,
          },
          Temperature:{
            type:DataTypes.STRING,
          },
          InverterStatus:{
            type:DataTypes.STRING,
          },
          BatteryStatus:{
            type:DataTypes.STRING,
          },
          BatteryCharge:{
            type:DataTypes.STRING,
          },
          HighDC:{
            type:DataTypes.STRING,
          },
          OverLoad:{
            type:DataTypes.STRING,
          },
          OverTemperature:{
            type:DataTypes.STRING,
          },
          ShortCircuit:{
            type:DataTypes.STRING,
          },
          EmergencyStop:{
            type:DataTypes.STRING,
          },
          Okay:{
            type:DataTypes.STRING,
          },
          BatteryShutDown:{
            type:DataTypes.STRING,
          },
          BatteryLow:{
            type:DataTypes.STRING,
          },
          Mains:{
            type:DataTypes.STRING,
          },
          Load1:{
            type:DataTypes.STRING,
          },
          Load2:{
            type:DataTypes.STRING,
          },
          Load3:{
            type:DataTypes.STRING,
          },
          Company:{
            type:DataTypes.STRING,
          },
          Model:{
            type:DataTypes.STRING,
          },
          version:{
            type:DataTypes.STRING,
          },
          RectifierNeutral:{
            type:DataTypes.STRING,
          },
          RectifierPhase:{
            type:DataTypes.STRING,
          },
      
          RectifierTopology:{
            type:DataTypes.STRING,
          },
          RectifierFrequency:{
            type:DataTypes.STRING,
          },
          BypassNeutral:{
            type:DataTypes.STRING,
          },
          BypassPhase:{
            type:DataTypes.STRING,
          },
          BypassTopology:{
            type:DataTypes.STRING,
          },
          BypassFrequency:{
            type:DataTypes.STRING,
          },
          OutputNeutral:{
            type:DataTypes.STRING,
          },
          OutputPhase:{
            type:DataTypes.STRING,
          },
          OutputTopology:{
            type:DataTypes.STRING,
          },
          OutputFrequency:{
            type:DataTypes.STRING,
          },
       
          UpsBatteryVoltage:{
            type:DataTypes.STRING,
          },
          PowerRating:{
            type:DataTypes.STRING,
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
        tableName: 'UnilineMacMapping'
      }
    
    );
    UnilineMacMapping.associate = function (models) {
      // associations can be defined here
    };
    return UnilineMacMapping;
  };