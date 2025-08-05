'use strict';
module.exports = (sequelize, DataTypes) => {
  const MobivendQrCodes = sequelize.define('MobivendQrCodes', {
    name: DataTypes.STRING,
    QrString: DataTypes.STRING,
    merchantId: DataTypes.STRING
  }, {});
  MobivendQrCodes.associate = function(models) {
    // associations can be defined here
  };
  return MobivendQrCodes;
};