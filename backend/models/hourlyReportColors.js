'use strict';
module.exports = (sequelize, DataTypes) => {
  const colorSettings = sequelize.define('colorSettings', {
    Primary:DataTypes.STRING,
    Secondary:DataTypes.STRING,
    Tertiary:DataTypes.STRING,
    Faulty:DataTypes.STRING,
    Range1:DataTypes.STRING,
    Range2:DataTypes.STRING,
    Range3:DataTypes.STRING,
    Range4:DataTypes.STRING,
  }, {
    tableName: 'colorSettings'
  });
  colorSettings.associate = function(models) {
    // associations can be defined here
  };
  return colorSettings;
};