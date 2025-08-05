'use strict';
module.exports = (sequelize, DataTypes) => {
  const MobiVendTxns = sequelize.define('MobiVendTxns', {
    qrCodeId: DataTypes.STRING,
    serial: DataTypes.STRING,
    txnId: DataTypes.STRING,
    txnType: DataTypes.STRING,
    status: DataTypes.STRING,
    amount: DataTypes.STRING,
    VendingStatus: DataTypes.STRING
  }, {});
  MobiVendTxns.associate = function(models) {
    // associations can be defined here
  };
  return MobiVendTxns;
}; 