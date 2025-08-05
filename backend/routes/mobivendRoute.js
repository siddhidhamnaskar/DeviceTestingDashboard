const express=require("express");
const {
    getAllMobiVendDevices,
    getMobiVendDeviceBySerial,
    getMobiVendDeviceById,
    createMobiVendDevice,
    updateMobiVendDevice,
    deleteMobiVendDevice,
    getAllMobiVendQrCodes,
    getMobiVendQrCodeByMerchantId,
    getMobiVendQrCodeById,
    createMobiVendQrCode,
    updateMobiVendQrCode,
    deleteMobiVendQrCode,
    getAllMobiVendTxns,
    getMobiVendTxnById,
    createMobiVendTxn,
    getAllMobivendVendings,
    getMobivendVendingById,
    createMobivendVending
} = require("../controllers/MobiVendDevice");

const router=express.Router();

// MobiVendDevices routes
router.get('/devices',getAllMobiVendDevices);
router.post('/devices/search',getMobiVendDeviceBySerial);
router.get('/devices/:id',getMobiVendDeviceById);
router.post('/devices',createMobiVendDevice);
router.put('/devices/:id',updateMobiVendDevice);
router.delete('/devices/:id',deleteMobiVendDevice);

// MobiVendQrCodes routes
router.get('/qrcodes',getAllMobiVendQrCodes);
router.post('/qrcodes/search',getMobiVendQrCodeByMerchantId);
router.get('/qrcodes/:id',getMobiVendQrCodeById);
router.post('/qrcodes',createMobiVendQrCode);
router.put('/qrcodes/:id',updateMobiVendQrCode);
router.delete('/qrcodes/:id',deleteMobiVendQrCode);

// Legacy route for backward compatibility
router.post('/getAllMobiVendDevices',getMobiVendDeviceBySerial);
router.post('/getAllMobiVendQrCodes',getMobiVendQrCodeByMerchantId);

// MobiVendTxns routes
router.get('/transactions',getAllMobiVendTxns);
router.get('/transactions/:id',getMobiVendTxnById);
router.post('/transactions',createMobiVendTxn);

// MobivendVendings routes
router.get('/vendings',getAllMobivendVendings);
router.get('/vendings/:id',getMobivendVendingById);
router.post('/vendings',createMobivendVending);

module.exports=router;