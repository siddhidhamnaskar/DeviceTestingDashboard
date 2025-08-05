const express=require("express");
const {getTcResponse,getNetFailData,getPowerFailData, getMachineStatus}=require("../../controllers/KwikPay/getDatabse");
const {
    getAllMacAddress,
    getData,
    saveINHoutput,
    sendFota,
    sendReset,
    sendV,
    sendTC,
    sendFW,
    sendTV,
    sendFotaUrl,
    askUrl,
    sendCC,
    askCC,
    sendIMG,
    askStatus,
    sendQR,
    askQR,
    sendLight,
    sendHBT,
    sendSIP,
    askSIP,
    sendSSID,
    askSSID,
    sendPWD,
    sendSSID1,
    sendPWD1,
    sendSSID2,
    sendPWD2,
    sendCA,
    askCA,
    modeTest1,
    modeTest2,
    modeTest3,
    modeNone,
    getTestMode,
    setTestMode,
    setSN,
    checkSN,
    setErase,
    checkErase,
    setPair,
    checkPair,
    setL,
    getSerialPorts,
    sendPassThru,
    checkPassThru,
    sendD,
    sendVS,
    sendMessage
} = require('../../controllers/KwikPay/macAddress');

const router = express.Router();
router.get('/getMacAddress', getAllMacAddress);
router.get('/getData', getData);
router.post('/saveINHoutput', saveINHoutput);
router.post('/sendFota', sendFota);
router.post('/reset', sendReset);
router.post('/sendV', sendV);
router.post('/sendTC', sendTC);
router.post('/sendFW', sendFW);
router.post('/sendTV', sendTV);
router.post('/sendFotaUrl', sendFotaUrl);
router.post('/askUrl', askUrl);
router.post('/sendCC', sendCC);
router.post('/askCC', askCC);
router.post('/sendIMG', sendIMG);
router.post('/askStatus', askStatus);
router.post('/sendQR', sendQR);
router.post('/askQR', askQR);
router.post('/sendLight', sendLight);
router.post('/sendHBT', sendHBT);
router.post('/sendSIP', sendSIP);
router.post('/askSIP', askSIP);
router.post('/sendSSID', sendSSID);
router.post('/askSSID', askSSID);
router.post('/sendPWD', sendPWD);
router.post('/sendSSID1', sendSSID1);
router.post('/sendPWD1', sendPWD1);
router.post('/sendSSID2', sendSSID2);
router.post('/sendPWD2', sendPWD2);
router.post('/sendCA', sendCA);
router.post('/askCA', askCA);
router.post('/modeTest1', modeTest1);
router.post('/modeTest2', modeTest2);
router.post('/modeTest3', modeTest3);
router.post('/modeNone', modeNone);
router.get('/getTestMode', getTestMode);
router.post('/setTestMode', setTestMode);
router.post('/setSN', setSN);
router.post('/checkSN', checkSN);
router.post('/setErase', setErase);
router.post('/checkErase', checkErase);
router.post('/setPair', setPair);
router.post('/checkPair', checkPair);
router.post('/setL', setL);
router.get('/getSerialPorts', getSerialPorts);
router.post('/sendPassThru', sendPassThru);
router.post('/checkPassThru', checkPassThru);
router.post('/sendD', sendD);
router.post('/sendVS', sendVS);
router.post('/sendMessage', sendMessage);
router.post('/getTcResponse', getTcResponse);
router.post('/getNetFailData', getNetFailData);
router.post('/getPowerFailData', getPowerFailData);
router.post('/getMachineStatus', getMachineStatus);


module.exports = router;