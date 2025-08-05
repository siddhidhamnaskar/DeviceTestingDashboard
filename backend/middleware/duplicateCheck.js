const {MobiVendDevices, MobivendQrCodes} = require('../models');

// Middleware to check for duplicate devices
const checkDeviceDuplicates = async (req, res, next) => {
    try {
        const {serial, merchantId} = req.body;
        const deviceId = req.params.id; // For updates
        
        if (!serial || !merchantId) {
            return next(); // Let the main controller handle validation
        }
        
        const trimmedSerial = serial.trim();
        const trimmedMerchantId = merchantId.trim();
        
        // Build where clause
        const whereClause = {};
        if (deviceId) {
            whereClause.id = { [require('sequelize').Op.ne]: deviceId };
        }
        
        // Check for duplicates
        const duplicateSerial = await MobiVendDevices.findOne({
            where: { ...whereClause, serial: trimmedSerial }
        });
        
        const duplicateMerchantId = await MobiVendDevices.findOne({
            where: { ...whereClause, merchantId: trimmedMerchantId }
        });
        
        if (duplicateSerial) {
            return res.status(409).json({
                error: 'Device with this serial number already exists',
                existingDevice: {
                    id: duplicateSerial.id,
                    serial: duplicateSerial.serial,
                    merchantId: duplicateSerial.merchantId
                },
                field: 'serial'
            });
        }
        
        if (duplicateMerchantId) {
            return res.status(409).json({
                error: 'Device with this merchant ID already exists',
                existingDevice: {
                    id: duplicateMerchantId.id,
                    serial: duplicateMerchantId.serial,
                    merchantId: duplicateMerchantId.merchantId
                },
                field: 'merchantId'
            });
        }
        
        // Add trimmed values to request for use in controller
        req.body.trimmedSerial = trimmedSerial;
        req.body.trimmedMerchantId = trimmedMerchantId;
        
        next();
    } catch (error) {
        console.error('Error in checkDeviceDuplicates:', error);
        res.status(500).json({error: 'Internal server error during duplicate check'});
    }
};

// Middleware to check for duplicate QR codes
const checkQrCodeDuplicates = async (req, res, next) => {
    try {
        const {name, QrString, merchantId} = req.body;
        const qrCodeId = req.params.id; // For updates
        
        if (!name || !QrString || !merchantId) {
            return next(); // Let the main controller handle validation
        }
        
        const trimmedName = name.trim();
        const trimmedQrString = QrString.trim();
        const trimmedMerchantId = merchantId.trim();
        
        // Build where clause
        const whereClause = {};
        if (qrCodeId) {
            whereClause.id = { [require('sequelize').Op.ne]: qrCodeId };
        }
        
        // Check for duplicates
        const duplicateName = await MobivendQrCodes.findOne({
            where: { ...whereClause, name: trimmedName }
        });
        
        const duplicateQrString = await MobivendQrCodes.findOne({
            where: { ...whereClause, QrString: trimmedQrString }
        });
        
        const duplicateMerchantId = await MobivendQrCodes.findOne({
            where: { ...whereClause, merchantId: trimmedMerchantId }
        });
        
        if (duplicateName) {
            return res.status(409).json({
                error: 'QR Code with this name already exists',
                existingQrCode: {
                    id: duplicateName.id,
                    name: duplicateName.name,
                    merchantId: duplicateName.merchantId
                },
                field: 'name'
            });
        }
        
        if (duplicateQrString) {
            return res.status(409).json({
                error: 'QR Code with this QR string already exists',
                existingQrCode: {
                    id: duplicateQrString.id,
                    name: duplicateQrString.name,
                    merchantId: duplicateQrString.merchantId
                },
                field: 'QrString'
            });
        }
        
        if (duplicateMerchantId) {
            return res.status(409).json({
                error: 'QR Code with this merchant ID already exists',
                existingQrCode: {
                    id: duplicateMerchantId.id,
                    name: duplicateMerchantId.name,
                    merchantId: duplicateMerchantId.merchantId
                },
                field: 'merchantId'
            });
        }
        
        // Add trimmed values to request for use in controller
        req.body.trimmedName = trimmedName;
        req.body.trimmedQrString = trimmedQrString;
        req.body.trimmedMerchantId = trimmedMerchantId;
        
        next();
    } catch (error) {
        console.error('Error in checkQrCodeDuplicates:', error);
        res.status(500).json({error: 'Internal server error during duplicate check'});
    }
};

// Generic duplicate checker for any model
const checkDuplicates = (model, fields, excludeIdField = 'id') => {
    return async (req, res, next) => {
        try {
            const data = req.body;
            const excludeId = req.params[excludeIdField];
            
            if (!data) {
                return next();
            }
            
            // Build where clause for exclusion
            const whereClause = {};
            if (excludeId) {
                whereClause[excludeIdField] = { [require('sequelize').Op.ne]: excludeId };
            }
            
            // Check each field for duplicates
            for (const field of fields) {
                if (data[field]) {
                    const trimmedValue = data[field].trim();
                    const duplicate = await model.findOne({
                        where: { ...whereClause, [field]: trimmedValue }
                    });
                    
                    if (duplicate) {
                        return res.status(409).json({
                            error: `${model.name} with this ${field} already exists`,
                            existingRecord: duplicate,
                            field: field
                        });
                    }
                    
                    // Add trimmed value to request
                    req.body[`trimmed${field.charAt(0).toUpperCase() + field.slice(1)}`] = trimmedValue;
                }
            }
            
            next();
        } catch (error) {
            console.error(`Error in checkDuplicates for ${model.name}:`, error);
            res.status(500).json({error: 'Internal server error during duplicate check'});
        }
    };
};

module.exports = {
    checkDeviceDuplicates,
    checkQrCodeDuplicates,
    checkDuplicates
}; 