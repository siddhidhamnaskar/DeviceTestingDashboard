const express=require("express");
const { 
    sendToMqtt, 
    getAllMacAddress, 
    saveDeviceConfig, 
    updateDeviceConfigResponse 
} = require('../controllers/SendToMqtt/sendToMqtt');
const router = express.Router();

// MQTT endpoints
router.post('/sendToMqtt', sendToMqtt);
router.get('/getAllMacAddress', getAllMacAddress);

// Device config endpoints
router.post('/saveDeviceConfig', saveDeviceConfig);
router.put('/updateDeviceResponse', updateDeviceConfigResponse);

module.exports = router;