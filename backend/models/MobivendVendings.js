'use strict';
module.exports = (sequelize, DataTypes) => {
  const MobivendVendings = sequelize.define('MobivendVendings', {
    serial: DataTypes.STRING,
    txnId: DataTypes.STRING,
    SID: DataTypes.STRING,
    price: DataTypes.STRING,
    spiralNumber: DataTypes.STRING
  }, {});
  MobivendVendings.associate = function(models) {
    // associations can be defined here
  };
  return MobivendVendings;
}; 