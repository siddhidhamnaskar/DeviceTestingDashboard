'use strict';
module.exports = (sequelize, DataTypes) => {
  const MobiVendDevices = sequelize.define('MobiVendDevices', {
    serial: {
      type: DataTypes.STRING,
      allowNull: false
    },
    merchantId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Ensure merchant ID is unique
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Category classification for the device'
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['merchantId']
      }
    ]
  });
  MobiVendDevices.associate = function(models) {
    // associations can be defined here
  };
  return MobiVendDevices;
};