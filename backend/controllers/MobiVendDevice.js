const {MobiVendDevices,MobivendQrCodes,MobiVendTxns,MobivendVendings} = require('../models');

// Utility function to check for duplicates with detailed error information
const checkDuplicateDevice = async (serial, merchantId, excludeId = null) => {
    const whereClause = {};
    if (excludeId) {
        whereClause.id = { [require('sequelize').Op.ne]: excludeId };
    }
    
    const duplicateSerial = await MobiVendDevices.findOne({
        where: { ...whereClause, serial: serial.trim() }
    });
    
    const duplicateMerchantId = await MobiVendDevices.findOne({
        where: { ...whereClause, merchantId: merchantId.trim() }
    });
    
    return {
        hasDuplicate: duplicateSerial || duplicateMerchantId,
        duplicateSerial,
        duplicateMerchantId
    };
};

const checkDuplicateQrCode = async (name, QrString, merchantId, excludeId = null) => {
    const whereClause = {};
    if (excludeId) {
        whereClause.id = { [require('sequelize').Op.ne]: excludeId };
    }
    
    const duplicateName = await MobivendQrCodes.findOne({
        where: { ...whereClause, name: name.trim() }
    });
    
    const duplicateQrString = await MobivendQrCodes.findOne({
        where: { ...whereClause, QrString: QrString.trim() }
    });
    
    const duplicateMerchantId = await MobivendQrCodes.findOne({
        where: { ...whereClause, merchantId: merchantId.trim() }
    });
    
    return {
        hasDuplicate: duplicateName || duplicateQrString || duplicateMerchantId,
        duplicateName,
        duplicateQrString,
        duplicateMerchantId
    };
};


// Get device by serial number (existing function)
const getMobiVendDeviceBySerial=async(req,res)=>{
    try{
       
        console.log('Request body:', req.body);
        
        if (!req.body) {
            return res.status(400).json({error: 'Request body is missing'});
        }
        
        const {serial} = req.body;
        console.log('Serial from body:', serial);
        
        if (!serial) {
            return res.status(400).json({error: 'Serial number is required in request body'});
        }
        
        // Use findAll to get all devices with the same serial number
        const devices = await MobiVendDevices.findAll({
            where: {serial: serial},
            order: [['createdAt', 'DESC']] // Most recent first
        });
        
        // Return the first device for backward compatibility, but also include count
        const firstDevice = devices.length > 0 ? devices[0] : null;
        
        res.status(200).json({
            data: firstDevice,
            allDevices: devices,
            count: devices.length,
            hasMultiple: devices.length > 1
        });
    }
    catch(err){
        console.log('Error in getMobiVendDeviceBySerial:', err);
        res.status(500).json({status:500, error: err.message})
    }
}

// Get all devices with pagination and filtering
const getAllMobiVendDevices=async(req,res)=>{
    try{
        console.log('Request query:', req.query);
        
        // Get query parameters for filtering and pagination
        const {serial, merchantId, category, limit = 100, offset = 0} = req.query;
        
        // Build where clause based on provided parameters
        const whereClause = {};
        if (serial) whereClause.serial = { [require('sequelize').Op.like]: `%${serial}%` };
        if (merchantId) whereClause.merchantId = { [require('sequelize').Op.like]: `%${merchantId}%` };
        if (category) whereClause.category = { [require('sequelize').Op.like]: `%${category}%` };
        
        console.log('Where clause:', whereClause);
        
        const devices = await MobiVendDevices.findAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']] // Most recent first
        });
        
        // Get total count for pagination
        const totalCount = await MobiVendDevices.count({where: whereClause});
        
        res.status(200).json({
            success: true,
            data: devices,
            pagination: {
                total: totalCount,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: (parseInt(offset) + parseInt(limit)) < totalCount
            }
        });
    }
    catch(err){
        console.log('Error in getAllMobiVendDevices:', err);
        res.status(500).json({status:500, error: err.message})
    }
}

// Get QR code by merchant ID (existing function)
const getMobiVendQrCodeByMerchantId=async(req,res)=>{
    try{
       
        console.log('Request body:', req.body);
        
        if (!req.body) {
            return res.status(400).json({error: 'Request body is missing'});
        }
        
        const {merchant_id} = req.body;
        console.log('Merchant ID from body:', merchant_id);
        
        if (!merchant_id) {
            return res.status(400).json({error: 'Merchant ID is required in request body'});
        }
        
        const obj = await MobivendQrCodes.findOne({where:{merchantId:merchant_id}});
        res.status(200).json({data:obj})
    }
    catch(err){
        console.log('Error in getMobiVendQrCodeByMerchantId:', err);
        res.status(500).json({status:500, error: err.message})
    }
}

// Get all QR codes with pagination and filtering
const getAllMobiVendQrCodes=async(req,res)=>{
    try{
        console.log('Request query:', req.query);
        
        // Get query parameters for filtering and pagination
        const {name, QrString, merchantId, limit = 100, offset = 0} = req.query;
        
        // Build where clause based on provided parameters
        const whereClause = {};
        if (name) whereClause.name = { [require('sequelize').Op.like]: `%${name}%` };
        if (QrString) whereClause.QrString = { [require('sequelize').Op.like]: `%${QrString}%` };
        if (merchantId) whereClause.merchantId = { [require('sequelize').Op.like]: `%${merchantId}%` };
        
        console.log('Where clause:', whereClause);
        
        const qrCodes = await MobivendQrCodes.findAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']] // Most recent first
        });
        
        // Get total count for pagination
        const totalCount = await MobivendQrCodes.count({where: whereClause});
        
        res.status(200).json({
            success: true,
            data: qrCodes,
            pagination: {
                total: totalCount,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: (parseInt(offset) + parseInt(limit)) < totalCount
            }
        });
    }
    catch(err){
        console.log('Error in getAllMobiVendQrCodes:', err);
        res.status(500).json({status:500, error: err.message})
    }
}

const getAllMobiVendTxns=async(req,res)=>{
    try{
        console.log('Request body:', req.body);
        
        // Get query parameters for filtering
        const {serial, qrCodeId, txnId, status, limit = 100, offset = 0} = req.query;
        
        // Build where clause based on provided parameters
        const whereClause = {};
        if (serial) whereClause.serial = serial;
        if (qrCodeId) whereClause.qrCodeId = qrCodeId;
        if (txnId) whereClause.txnId = txnId;
        if (status) whereClause.status = status;
        
        console.log('Where clause:', whereClause);
        
        const transactions = await MobiVendTxns.findAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']] // Most recent first
        });
        
        // Get total count for pagination
        const totalCount = await MobiVendTxns.count({where: whereClause});
        
        res.status(200).json({
            success: true,
            data: transactions,
            pagination: {
                total: totalCount,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: (parseInt(offset) + parseInt(limit)) < totalCount
            }
        });
    }
    catch(err){
        console.log('Error in getAllMobiVendTxns:', err);
        res.status(500).json({status:500, error: err.message})
    }
}

const getMobiVendTxnById=async(req,res)=>{
    try{
        const {id} = req.params;
        
        if (!id) {
            return res.status(400).json({error: 'Transaction ID is required'});
        }
        
        const transaction = await MobiVendTxns.findByPk(id);
        
        if (!transaction) {
            return res.status(404).json({error: 'Transaction not found'});
        }
        
        res.status(200).json({
            success: true,
            data: transaction
        });
    }
    catch(err){
        console.log('Error in getMobiVendTxnById:', err);
        res.status(500).json({status:500, error: err.message})
    }
}

const createMobiVendTxn=async(req,res)=>{
    try{
        console.log('Request body:', req.body);
        
        if (!req.body) {
            return res.status(400).json({error: 'Request body is missing'});
        }
        
        const {qrCodeId, serial, txnId, txnType, status, amount} = req.body;
        
        // Validate required fields
        if (!txnId) {
            return res.status(400).json({error: 'Transaction ID is required'});
        }
        
        // Check if transaction already exists
        const existingTxn = await MobiVendTxns.findOne({where: {txnId: txnId}});
        if (existingTxn) {
            return res.status(409).json({error: 'Transaction with this ID already exists'});
        }
        
        const newTransaction = await MobiVendTxns.create({
            qrCodeId,
            serial,
            txnId,
            txnType,
            status,
            amount
        });
        
        res.status(201).json({
            success: true,
            data: newTransaction,
            message: 'Transaction created successfully'
        });
    }
    catch(err){
        console.log('Error in createMobiVendTxn:', err);
        res.status(500).json({status:500, error: err.message})
    }
}

const getAllMobivendVendings=async(req,res)=>{
    try{
        console.log('Request query:', req.query);
        
        // Get query parameters for filtering
        const {serial, txnId, SID, spiralNumber, limit = 100, offset = 0} = req.query;
        
        // Build where clause based on provided parameters
        const whereClause = {};
        if (serial) whereClause.serial = serial;
        if (txnId) whereClause.txnId = txnId;
        if (SID) whereClause.SID = SID;
        if (spiralNumber) whereClause.spiralNumber = spiralNumber;
        
        console.log('Where clause:', whereClause);
        
        const vendings = await MobivendVendings.findAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']] // Most recent first
        });
        
        // Get total count for pagination
        const totalCount = await MobivendVendings.count({where: whereClause});
        
        res.status(200).json({
            success: true,
            data: vendings,
            pagination: {
                total: totalCount,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: (parseInt(offset) + parseInt(limit)) < totalCount
            }
        });
    }
    catch(err){
        console.log('Error in getAllMobivendVendings:', err);
        res.status(500).json({status:500, error: err.message})
    }
}

const getMobivendVendingById=async(req,res)=>{
    try{
        const {id} = req.params;
        
        if (!id) {
            return res.status(400).json({error: 'Vending ID is required'});
        }
        
        const vending = await MobivendVendings.findByPk(id);
        
        if (!vending) {
            return res.status(404).json({error: 'Vending record not found'});
        }
        
        res.status(200).json({
            success: true,
            data: vending
        });
    }
    catch(err){
        console.log('Error in getMobivendVendingById:', err);
        res.status(500).json({status:500, error: err.message})
    }
}

const createMobivendVending=async(req,res)=>{
    try{
        console.log('Request body:', req.body);
        
        if (!req.body) {
            return res.status(400).json({error: 'Request body is missing'});
        }
        
        const {serial, txnId, SID, price, spiralNumber} = req.body;
        
        // Validate required fields
        if (!txnId) {
            return res.status(400).json({error: 'Transaction ID is required'});
        }
        
        // Check if vending record already exists
        const existingVending = await MobivendVendings.findOne({where: {txnId: txnId}});
        if (existingVending) {
            return res.status(409).json({error: 'Vending record with this Transaction ID already exists'});
        }
        
        const newVending = await MobivendVendings.create({
            serial,
            txnId,
            SID,
            price,
            spiralNumber
        });
        
        res.status(201).json({
            success: true,
            data: newVending,
            message: 'Vending record created successfully'
        });
    }
    catch(err){
        console.log('Error in createMobivendVending:', err);
        res.status(500).json({status:500, error: err.message})
    }
}

// Get device by ID
const getMobiVendDeviceById=async(req,res)=>{
    try{
        const {id} = req.params;
        
        if (!id) {
            return res.status(400).json({error: 'Device ID is required'});
        }
        
        const device = await MobiVendDevices.findByPk(id);
        
        if (!device) {
            return res.status(404).json({error: 'Device not found'});
        }
        
        res.status(200).json({
            success: true,
            data: device
        });
    }
    catch(err){
        console.log('Error in getMobiVendDeviceById:', err);
        res.status(500).json({status:500, error: err.message})
    }
}

// Create new device
const createMobiVendDevice=async(req,res)=>{
    try{
        console.log('Request body:', req.body);
        
        if (!req.body) {
            return res.status(400).json({error: 'Request body is missing'});
        }
        
        const {serial, merchantId, category} = req.body;
        
        // Validate required fields
        if (!serial) {
            return res.status(400).json({error: 'Serial number is required'});
        }
        if (!merchantId) {
            return res.status(400).json({error: 'Merchant ID is required'});
        }
        
        // Use trimmed values from middleware or trim them here
        const trimmedSerial = req.body.trimmedSerial || serial.trim();
        const trimmedMerchantId = req.body.trimmedMerchantId || merchantId.trim();
        
        // Check for duplicate merchant ID (prevent duplicate merchant IDs)
        const existingMerchantId = await MobiVendDevices.findOne({
            where: {
                merchantId: trimmedMerchantId
            }
        });
        
        if (existingMerchantId) {
            return res.status(409).json({
                error: 'Merchant ID already exists. Each merchant ID must be unique.',
                existingDevice: {
                    id: existingMerchantId.id,
                    serial: existingMerchantId.serial,
                    merchantId: existingMerchantId.merchantId
                }
            });
        }
        
        // Check for exact duplicate row (same serial AND same merchantId) - additional safety check
        const existingDevice = await MobiVendDevices.findOne({
            where: {
                serial: trimmedSerial,
                merchantId: trimmedMerchantId
            }
        });
        
        if (existingDevice) {
            return res.status(409).json({
                error: 'Device with this exact serial and merchant ID combination already exists',
                existingDevice: {
                    id: existingDevice.id,
                    serial: existingDevice.serial,
                    merchantId: existingDevice.merchantId
                }
            });
        }
        
        const newDevice = await MobiVendDevices.create({
            serial: trimmedSerial,
            merchantId: trimmedMerchantId,
            category: category || null
        });
        
        res.status(201).json({
            success: true,
            data: newDevice,
            message: 'Device created successfully'
        });
    }
    catch(err){
        console.log('Error in createMobiVendDevice:', err);
        res.status(500).json({status:500, error: err.message})
    }
}

// Update device
const updateMobiVendDevice=async(req,res)=>{
    try{
        const {id} = req.params;
        console.log('Request body:', req.body);
        
        if (!id) {
            return res.status(400).json({error: 'Device ID is required'});
        }
        
        if (!req.body) {
            return res.status(400).json({error: 'Request body is missing'});
        }
        
        const {serial, merchantId, category} = req.body;
        
        // Validate required fields
        if (!serial) {
            return res.status(400).json({error: 'Serial number is required'});
        }
        if (!merchantId) {
            return res.status(400).json({error: 'Merchant ID is required'});
        }
        
        // Use trimmed values from middleware or trim them here
        const trimmedSerial = req.body.trimmedSerial || serial.trim();
        const trimmedMerchantId = req.body.trimmedMerchantId || merchantId.trim();
        
        // Check if device exists
        const existingDevice = await MobiVendDevices.findByPk(id);
        if (!existingDevice) {
            return res.status(404).json({error: 'Device not found'});
        }
        
        // Check for duplicate merchant ID (prevent duplicate merchant IDs)
        // Only check if the merchant ID is being changed
        if (existingDevice.merchantId !== trimmedMerchantId) {
            const existingMerchantId = await MobiVendDevices.findOne({
                where: {
                    merchantId: trimmedMerchantId,
                    id: { [require('sequelize').Op.ne]: id } // Exclude current device from check
                }
            });
            
            if (existingMerchantId) {
                return res.status(409).json({
                    error: 'Merchant ID already exists. Each merchant ID must be unique.',
                    existingDevice: {
                        id: existingMerchantId.id,
                        serial: existingMerchantId.serial,
                        merchantId: existingMerchantId.merchantId
                    }
                });
            }
        }
        
        // Update device
        await existingDevice.update({
            serial: trimmedSerial,
            merchantId: trimmedMerchantId,
            category: category || null
        });
        
        res.status(200).json({
            success: true,
            data: existingDevice,
            message: 'Device updated successfully'
        });
    }
    catch(err){
        console.log('Error in updateMobiVendDevice:', err);
        res.status(500).json({status:500, error: err.message})
    }
}

// Delete device
const deleteMobiVendDevice=async(req,res)=>{
    try{
        const {id} = req.params;
        
        if (!id) {
            return res.status(400).json({error: 'Device ID is required'});
        }
        
        // Check if device exists
        const existingDevice = await MobiVendDevices.findByPk(id);
        if (!existingDevice) {
            return res.status(404).json({error: 'Device not found'});
        }
        
        // Delete device
        await existingDevice.destroy();
        
        res.status(200).json({
            success: true,
            message: 'Device deleted successfully'
        });
    }
    catch(err){
        console.log('Error in deleteMobiVendDevice:', err);
        res.status(500).json({status:500, error: err.message})
    }
}

// Get QR code by ID
const getMobiVendQrCodeById=async(req,res)=>{
    try{
        const {id} = req.params;
        
        if (!id) {
            return res.status(400).json({error: 'QR Code ID is required'});
        }
        
        const qrCode = await MobivendQrCodes.findByPk(id);
        
        if (!qrCode) {
            return res.status(404).json({error: 'QR Code not found'});
        }
        
        res.status(200).json({
            success: true,
            data: qrCode
        });
    }
    catch(err){
        console.log('Error in getMobiVendQrCodeById:', err);
        res.status(500).json({status:500, error: err.message})
    }
}

// Create new QR code
const createMobiVendQrCode=async(req,res)=>{
    try{
        console.log('Request body:', req.body);
        
        if (!req.body) {
            return res.status(400).json({error: 'Request body is missing'});
        }
        
        const {name, QrString, merchantId} = req.body;
        
        // Validate required fields
        if (!name) {
            return res.status(400).json({error: 'Name is required'});
        }
        if (!QrString) {
            return res.status(400).json({error: 'QR String is required'});
        }
        if (!merchantId) {
            return res.status(400).json({error: 'Merchant ID is required'});
        }
        
        // Use trimmed values from middleware or trim them here
        const trimmedName = req.body.trimmedName || name.trim();
        const trimmedQrString = req.body.trimmedQrString || QrString.trim();
        const trimmedMerchantId = req.body.trimmedMerchantId || merchantId.trim();
        
        const newQrCode = await MobivendQrCodes.create({
            name: trimmedName,
            QrString: trimmedQrString,
            merchantId: trimmedMerchantId
        });
        
        res.status(201).json({
            success: true,
            data: newQrCode,
            message: 'QR Code created successfully'
        });
    }
    catch(err){
        console.log('Error in createMobiVendQrCode:', err);
        res.status(500).json({status:500, error: err.message})
    }
}

// Update QR code
const updateMobiVendQrCode=async(req,res)=>{
    try{
        const {id} = req.params;
        console.log('Request body:', req.body);
        
        if (!id) {
            return res.status(400).json({error: 'QR Code ID is required'});
        }
        
        if (!req.body) {
            return res.status(400).json({error: 'Request body is missing'});
        }
        
        const {name, QrString, merchantId} = req.body;
        
        // Validate required fields
        if (!name) {
            return res.status(400).json({error: 'Name is required'});
        }
        if (!QrString) {
            return res.status(400).json({error: 'QR String is required'});
        }
        if (!merchantId) {
            return res.status(400).json({error: 'Merchant ID is required'});
        }
        
        // Use trimmed values from middleware or trim them here
        const trimmedName = req.body.trimmedName || name.trim();
        const trimmedQrString = req.body.trimmedQrString || QrString.trim();
        const trimmedMerchantId = req.body.trimmedMerchantId || merchantId.trim();
        
        // Check if QR code exists
        const existingQrCode = await MobivendQrCodes.findByPk(id);
        if (!existingQrCode) {
            return res.status(404).json({error: 'QR Code not found'});
        }
        
        // Update QR code
        await existingQrCode.update({
            name: trimmedName,
            QrString: trimmedQrString,
            merchantId: trimmedMerchantId
        });
        
        res.status(200).json({
            success: true,
            data: existingQrCode,
            message: 'QR Code updated successfully'
        });
    }
    catch(err){
        console.log('Error in updateMobiVendQrCode:', err);
        res.status(500).json({status:500, error: err.message})
    }
}

// Delete QR code
const deleteMobiVendQrCode=async(req,res)=>{
    try{
        const {id} = req.params;
        
        if (!id) {
            return res.status(400).json({error: 'QR Code ID is required'});
        }
        
        // Check if QR code exists
        const existingQrCode = await MobivendQrCodes.findByPk(id);
        if (!existingQrCode) {
            return res.status(404).json({error: 'QR Code not found'});
        }
        
        // Delete QR code
        await existingQrCode.destroy();
        
        res.status(200).json({
            success: true,
            message: 'QR Code deleted successfully'
        });
    }
    catch(err){
        console.log('Error in deleteMobiVendQrCode:', err);
        res.status(500).json({status:500, error: err.message})
    }
}

// Bulk delete devices
const bulkDeleteMobiVendDevices = async (req, res) => {
    try {
        const { deviceIds } = req.body;
        
        if (!deviceIds || !Array.isArray(deviceIds) || deviceIds.length === 0) {
            return res.status(400).json({ error: 'Device IDs array is required' });
        }
        
        // Check if all devices exist
        const existingDevices = await MobiVendDevices.findAll({
            where: { id: deviceIds }
        });
        
        if (existingDevices.length !== deviceIds.length) {
            return res.status(404).json({ 
                error: 'Some devices not found',
                found: existingDevices.length,
                requested: deviceIds.length
            });
        }
        
        // Delete all devices
        await MobiVendDevices.destroy({
            where: { id: deviceIds }
        });
        
        res.status(200).json({
            success: true,
            message: `${existingDevices.length} devices deleted successfully`,
            deletedCount: existingDevices.length
        });
    } catch (err) {
        console.log('Error in bulkDeleteMobiVendDevices:', err);
        res.status(500).json({ status: 500, error: err.message });
    }
};

module.exports={
    getAllMobiVendDevices,
    getMobiVendDeviceBySerial,
    getMobiVendDeviceById,
    createMobiVendDevice,
    updateMobiVendDevice,
    deleteMobiVendDevice,
    bulkDeleteMobiVendDevices,
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
}
