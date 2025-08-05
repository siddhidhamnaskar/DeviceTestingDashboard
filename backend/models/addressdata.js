'use strict';
module.exports = (sequelize, DataTypes) => {
  const AddressData = sequelize.define('AddressData', {
    uid: DataTypes.STRING,
    zone: DataTypes.STRING,
    ward: DataTypes.STRING,
    beat: DataTypes.STRING,
    objectId: DataTypes.STRING,
    address: DataTypes.STRING,
    num_seat: DataTypes.INTEGER,
    owner: DataTypes.STRING,
    agency: DataTypes.STRING,
    electric: DataTypes.STRING,
    seat_male: DataTypes.INTEGER,
    seat_female: DataTypes.INTEGER,
    mapped_serial: DataTypes.STRING,
    lat: DataTypes.STRING,
    lon: DataTypes.STRING
  }, {});
  AddressData.associate = function(models) {
    // associations can be defined here
  };
  return AddressData;
};