const MqttHandler = require('../../mqtt');
const mqttClient = new MqttHandler();
const {MqttMacMapping, DeviceConfig} = require('../../models');

const getAllMacAddress=async(req,res)=>{
    try{
        console.log('getAllMacAddress endpoint called');
        
        const obj = await MqttMacMapping.findAll();
        console.log('Found', obj.length, 'MqttMacMapping records');
        res.status(200).json({data:obj})
    }
    catch(err){
        console.log('Error in getAllMacAddress:', err);
        console.log('Error stack:', err.stack);
        res.status(500).json({status:500, error: err.message, stack: err.stack})
    }
}

// Helper function to save device config data
const saveDeviceConfigData = async (deviceData) => {
    try {
        const { UserName, EmailId, MacId, MachineId, Command, Response } = deviceData;
        
        // Validate required fields
        if (!UserName || !EmailId || !MacId || !MachineId || !Command) {
            throw new Error('Missing required fields for device config');
        }

        const deviceConfig = await DeviceConfig.create({
            UserName,
            EmailId,
            MacId,
            MachineId,
            Command,
            Response: Response || null,
            date: new Date()
        });

        console.log('Device config saved successfully:', deviceConfig.id);
        return deviceConfig;
    } catch (error) {
        console.error('Error saving device config:', error);
        throw error;
    }
};

const sendToMqtt = async (req, res) => {
    try {
        const { serialNumber, message, UserName, EmailId, MacId, MachineId } = req.body;
        
        // Validate required fields for MQTT
        if (!serialNumber || !message) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'serialNumber and message are required'
            });
        }

        // Send MQTT message
        mqttClient.sendMessage('GVC/KP/'+serialNumber, message);
        
        // Save device configuration data if user info is provided
        let deviceConfigSaved = false;
        if (UserName && EmailId && MacId && MachineId) {
            try {
                await saveDeviceConfigData({
                    UserName,
                    EmailId,
                    MacId,
                    MachineId,
                    Command: message
                });
                deviceConfigSaved = true;
            } catch (configError) {
                console.error('Error saving device config:', configError);
                // Don't fail the MQTT send if config save fails
            }
        }

        res.status(200).json({
            status: 200,
            message: 'MQTT message sent successfully',
            deviceConfigSaved,
            serialNumber,
            command: message
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({status:500, error: error.message})
    }
}

// Function to update device config response when device responds
const updateDeviceResponse = async (serialNumber, response) => {
    try {
        // Find the most recent device config for this serial number
        const deviceConfig = await DeviceConfig.findOne({
            where: {
                MachineId: serialNumber
            },
            order: [['createdAt', 'DESC']]
        });

        if (deviceConfig) {
            await deviceConfig.update({ Response: response });
            console.log('Device response updated for config ID:', deviceConfig.id);
            return deviceConfig;
        } else {
            console.log('No device config found for serial number:', serialNumber);
            return null;
        }
    } catch (error) {
        console.error('Error updating device response:', error);
        return null;
    }
};

// API endpoint to save device config independently
const saveDeviceConfig = async (req, res) => {
    try {
        const deviceConfig = await saveDeviceConfigData(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Device config saved successfully',
            data: deviceConfig
        });
    } catch (error) {
        res.status(400).json({
            error: 'Failed to save device config',
            message: error.message
        });
    }
};

// API endpoint to update device response
const updateDeviceConfigResponse = async (req, res) => {
    try {
        const { serialNumber, response } = req.body;
        
        if (!serialNumber || !response) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'serialNumber and response are required'
            });
        }

        const updatedConfig = await updateDeviceResponse(serialNumber, response);
        
        if (updatedConfig) {
            res.status(200).json({
                success: true,
                message: 'Device response updated successfully',
                data: updatedConfig
            });
        } else {
            res.status(404).json({
                error: 'Not found',
                message: 'No device config found for the given serial number'
            });
        }
    } catch (error) {
        console.error('Error updating device response:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to update device response'
        });
    }
};

module.exports = { 
    sendToMqtt, 
    getAllMacAddress, 
    updateDeviceResponse,
    saveDeviceConfig,
    updateDeviceConfigResponse
};