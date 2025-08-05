const { Op } = require("sequelize");
const moment = require("moment");
const { MqttMacMapping, Transaction, DeviceConfig } = require('../models');

const getISTDateTime = () => {
    const now = new Date();
  
    const parts = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).formatToParts(now);
  
    const map = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  
    return `${map.day}${map.month}${map.year}${map.hour}${map.minute}${map.second}`;
};

const getDateTime = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${hours}-${minutes}-${seconds}`;
    return `${formattedDate} ${formattedTime}`;
};

const parseMqttMessage = async (payload, mqttClient, topic) => {
    try {
        console.log(`MQTT Message received on topic ${topic}:`, payload.toString());
        
        // Split by comma to get command parts (payload is already cleaned)
        const parts = payload.toString().split(',');
        // console.log('Command parts:', parts);
        
        if (parts.length < 2) {
            // console.log('Invalid message format - insufficient parts');
            return;
        }
        
        const deviceId = parts[0];
        const command = parts[1];
      
        
        // Handle different command types similar to socketServer.js logic
        if (command.includes("MAC")) {
            let mqttMapping = await MqttMacMapping.findOne({
                where: { MacID: parts[1] }
            });
            
            if (!mqttMapping) {
                // console.log(`Creating new MqttMacMapping for device: ${deviceId}`);
                mqttMapping = await MqttMacMapping.create({
                    MacID: parts[1],
                    SNoutput: deviceId,
                    lastHeartBeatTime: new Date().toISOString()
                });
            }
            // console.log(`MAC command received from ${deviceId}`);
            
            // Extract serial number if available
            if (parts[2]) {
                mqttMapping.SNoutput = parts[2];
            }
            
            // Send DATA response
            mqttClient.publish(`GVC/KP/${deviceId}`, `*DATA:${getISTDateTime()}#`);
            
            // Create transaction record
            // await Transaction.create({
            //     machine: mqttMapping.SNoutput || deviceId,
            //     command: command,
            //     p1: parts[1],
            //     p2: parts[2] || '',
            //     p3: parts[3] || '',
            //     p4: parts[4] || ''
            // });
            
        } 
        else{
            let mqttMapping = await MqttMacMapping.findOne({
                where: { SNoutput: deviceId }
            });
            
            if(mqttMapping)
            {
             await  updateDeviceResponse(mqttMapping.SNoutput,payload.toString());
         if (command.includes("HBT")) {
            mqttMapping.HBToutput = payload.toString();
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();


            setTimeout(async () => {
                mqttMapping.HBToutput = '';
                await mqttMapping.save();
            }, 8000);
       
            
        } else if (command.includes("SIP")) {
            // console.log(`SIP command received from ${deviceId}`);
            
            // Store SIP message
            mqttMapping.SIPmessage = payload.toString();
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();
       
            
            // Clear SIP message after 8 seconds (similar to socketServer.js)
            setTimeout(async () => {
                mqttMapping.SIPmessage = '';
                await mqttMapping.save();
            }, 8000);
            
            // Create transaction record
            // await Transaction.create({
            //     machine: mqttMapping.SNoutput || deviceId,
            //     command: payload.toString()
            // });
            
        } else if (command.includes("FOTA")) {
            console.log(`FOTA command received from ${deviceId}`);
            
            // Store FOTA message
            mqttMapping.FotaMessage = payload.toString();
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.FotaMessage = '';
                await mqttMapping.save();
            }, 8000);
            
        } else if (command.includes("RST-OK")) {
            console.log(`RST command received from ${deviceId}`);
            
            // Store RST message
            mqttMapping.RstMessage = command;
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.RstMessage = '';
                await mqttMapping.save();
            }, 8000);

        } else if (command.includes("Mobivend") || command.includes("FW") || command.includes("KP") || command.includes("Kwikpay")||command.includes("Traffic") ) {
            console.log(`FW command received from ${deviceId}`);
            
            // Store FW output
            mqttMapping.FWoutput = command;
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.FWoutput = '';
                await mqttMapping.save();
            }, 8000);

        }else if (command.includes("URL-OK")) {
            console.log(`URL command received from ${deviceId}`);
            
            // Store URL output
            mqttMapping.FotaURLoutput = `${parts[1]}:${parts[2]}:${parts[3]}:${parts[4]}`;
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.FotaURLoutput = '';
                await mqttMapping.save();
            }, 8000);

            
        } else if (command.includes("URL")) {
            console.log(`URL command received from ${deviceId}`);
            
            // Store URL output
            mqttMapping.URLoutput = `${parts[1]}:${parts[2]}:${parts[3]}:${parts[4]}`;
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.URLoutput = '';
                await mqttMapping.save();
            }, 8000);

            
        } else if (command.includes("HBT")) {
            console.log(`HBT command received from ${deviceId}`);
            
            // Store HBT output
            mqttMapping.HBToutput = payload.toString();
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.HBToutput = '';
                await mqttMapping.save();
            }, 8000);

        }else if (command.includes("SSID")) {
            console.log(`SSID command received from ${deviceId}`);
            
            // Store SSID output
            mqttMapping.SSIDmessage =`${parts[1]}:${parts[2]}:${parts[3]}:${parts[4]}:${parts[5]}:${parts[6]}:${parts[7]}`;
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.SSIDmessage = '';
                await mqttMapping.save();
            }, 8000);
          
            
        } else if (command.includes("SS-OK")) {
            console.log(`SSID command received from ${deviceId}`);
            
            // Store SSID output
            mqttMapping.SSIDoutput =command;
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.SSIDoutput = '';
                await mqttMapping.save();
            }, 8000);
          
            
        } else if (command.includes("SS1-OK")) {
            console.log(`SSID1 command received from ${deviceId}`);
            
            // Store SSID1 output
            mqttMapping.SSID1output = command;
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.SSID1output = '';
                await mqttMapping.save();
            }, 8000);
            
        }else if (command.includes("SS2-OK")) {
            console.log(`SSID2 command received from ${deviceId}`);
            
            // Store SSID1 output
            mqttMapping.SSID2output = command;
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.SSID2output = '';
                await mqttMapping.save();
            }, 8000);
            
        } else if (command.includes("PW-OK")) {
            console.log(`PWD command received from ${deviceId}`);
            
            // Store PWD output
            mqttMapping.PWDoutput =command;
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.PWDoutput = '';
                await mqttMapping.save();
            }, 8000);
            
            
        } else if (command.includes("PW1-OK")) {
            console.log(`PWD1 command received from ${deviceId}`);
            
            // Store PWD1 output
            mqttMapping.PWD1output = command;
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.PWD1output = '';
                await mqttMapping.save();
            }, 8000);
            
        } else if (command.includes("PW2-OK")) {
            console.log(`PWD1 command received from ${deviceId}`);
            
            // Store PWD1 output
            mqttMapping.PWD2output = command;
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.PWD2output = '';
                await mqttMapping.save();
            }, 8000);
            
        }else if (command.includes("SN")) {
            console.log(`SN command received from ${deviceId}`);
            
            // Store SN output and message
            mqttMapping.SNoutput = payload.toString();
            mqttMapping.SNmessage = payload.toString();
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.SNoutput = '';
                await mqttMapping.save();
            }, 8000);
        
            
        } else if (command.includes("ERASE")) {
            console.log(`ERASE command received from ${deviceId}`);
            
            // Store ERASE output and message
            mqttMapping.ERASEoutput = payload.toString();
            mqttMapping.ERASEmessage = payload.toString();
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.ERASEoutput = '';
                await mqttMapping.save();
            }, 8000);

            
        }else if (command.includes("RSSI")) {
           
            // Store ERASE output and message
            mqttMapping.V1 = `${parts[1]}:${parts[2]}`;
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.V1 = '';
                await mqttMapping.save();
            }, 8000);

            
        }else if (command.includes("QR-OK")) {
           
            // Store ERASE output and message
            mqttMapping.V3 = command;
            mqttMapping.V2 = `${parts[1]}:${parts[2]}`;
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.V3 = '';
                await mqttMapping.save();
            }, 8000);

            
        } else if (command.includes("QR")) {
           
            // Store ERASE output and message
            mqttMapping.V2 = `${parts[1]}:${parts[2]}`;
            mqttMapping.V3 = command;
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.V2 = '';
                await mqttMapping.save();
            }, 8000);

            
        }else if (command.includes("H1")) {
            console.log(`H1 command received from ${deviceId}`);
            
            // Store H1 message
            mqttMapping.H1message = payload.toString();
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.H1message = '';
                await mqttMapping.save();
            }, 8000);
            
        } else if (command.includes("H2")) {
            console.log(`H2 command received from ${deviceId}`);
            
            // Store H2 message
            mqttMapping.H2message = payload.toString();
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.H2message = '';
                await mqttMapping.save();
            }, 8000);
            
        } else if (command.includes("H3")) {
            console.log(`H3 command received from ${deviceId}`);
            
            // Store H3 message
            mqttMapping.H3message = payload.toString();
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.H3message = '';
                await mqttMapping.save();
            }, 8000);
            
        } else if (command.includes("H4")) {
            console.log(`H4 command received from ${deviceId}`);
            
            // Store H4 message
            mqttMapping.H4message = payload.toString();
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.H4message = '';
                await mqttMapping.save();
            }, 8000);

        } else if (command.includes("FLASH")) {
            console.log(`FLASH command received from ${deviceId}`);
            
            // Store FLASH message
            mqttMapping.FLASHmessage = payload.toString();
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.FLASHmessage = '';
                await mqttMapping.save();
            }, 8000);
           
        } else if (command.includes("OFF")) {
            console.log(`OFF command received from ${deviceId}`);
            
            // Store OFF message
            mqttMapping.OFFmessage = command;
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.OFFmessage = '';
                await mqttMapping.save();
            }, 8000);
                
        } else if (command.includes("NEXT")) {
            console.log(`NEXT command received from ${deviceId}`);
            
            // Store NEXT message
            mqttMapping.NEXTmessage = payload.toString();
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.NEXTmessage = '';
                await mqttMapping.save();
            }, 8000);
            
        } else if (command.includes("AUTO")) {
            console.log(`AUTO command received from ${deviceId}`);
            
            // Store AUTO message
            mqttMapping.AUTOmessage = payload.toString();
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.AUTOmessage = '';
                await mqttMapping.save();
            }, 8000);
            
        } else if (command.includes("Q")) {
            console.log(`Q command received from ${deviceId}`);
            
            // Store Q message
            mqttMapping.Qmessage = payload.toString();
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.Qmessage = '';
                await mqttMapping.save();
            }, 8000);
            
        } else if (command.includes("C1")) {
            console.log(`C1 command received from ${deviceId}`);
            
            // Store C1 message
            mqttMapping.C1message = payload.toString();
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.C1message = '';
                await mqttMapping.save();
            }, 8000);
            
        } else if (command.includes("C2")) {
            console.log(`C2 command received from ${deviceId}`);
            
            // Store C2 message
            mqttMapping.C2message = payload.toString();
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.C2message = '';
                await mqttMapping.save();
            }, 8000);
            
        } else if (command.includes("C3")) {
            console.log(`C3 command received from ${deviceId}`);
            
            // Store C3 message
            mqttMapping.C3message = payload.toString();
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.C3message = '';
                await mqttMapping.save();
            }, 8000);
            
        } else if (command.includes("C4")) {
            console.log(`C4 command received from ${deviceId}`);
            
            // Store C4 message
            mqttMapping.C4message = payload.toString();
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.C4message = '';
                await mqttMapping.save();
            }, 8000);
            
        } else if (command.includes("C5")) {
            console.log(`C5 command received from ${deviceId}`);
            
            // Store C5 message
            mqttMapping.C5message = payload.toString();
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.C5message = '';
                await mqttMapping.save();
            }, 8000);
            
        } else if (command.includes("C6")) {
            console.log(`C6 command received from ${deviceId}`);
            
            // Store C6 message
            mqttMapping.C6message = payload.toString();
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.C6message = '';
                await mqttMapping.save();
            }, 8000);
            
        } else if (command.includes("C7")) {
            console.log(`C7 command received from ${deviceId}`);
            
            // Store C7 message
            mqttMapping.C7message = payload.toString();
            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();

            setTimeout(async () => {
                mqttMapping.C7message = '';
                await mqttMapping.save();
            }, 8000);
            
        } else {

            mqttMapping.lastHeartBeatTime = new Date().toISOString();
            await mqttMapping.save();
            // console.log(`Unknown command received: ${command} from ${deviceId}`);
            
            // Store in a generic field or create a new field for unknown commands
            // For now, we'll just log it
        }
       
        
        // Save the updated mapping
      

     
        
        // console.log(`MqttMacMapping updated for device: ${deviceId}`);
        }
        }
        
    } catch (error) {
        console.error('Error parsing MQTT message:', error);
    }
};

// Function to send commands to MQTT devices (similar to socketServer.js send functions)
const sendMqttCommand = (mqttClient, topic, command, deviceId) => {
    try {
        console.log(`Sending MQTT command to ${topic}: ${command}`);
        mqttClient.publish(topic, command);
        
        // Update the corresponding field in MqttMacMapping
        updateMqttMappingField(deviceId, command);
        
    } catch (error) {
        console.error('Error sending MQTT command:', error);
    }
};

const updateMqttMappingField = async (deviceId, command) => {
    try {
        const mqttMapping = await MqttMacMapping.findOne({
            where: { MacID: deviceId }
        });
        
        if (mqttMapping) {
            // Update the appropriate field based on the command
            if (command.includes("*FOTA")) {
                mqttMapping.FotaMessage = command;
            } else if (command.includes("*RST")) {
                mqttMapping.RstMessage = command;
            } else if (command.includes("*FW")) {
                mqttMapping.FWoutput = command;
            } else if (command.includes("*URL")) {
                mqttMapping.URLoutput = command;
            } else if (command.includes("*HBT")) {
                mqttMapping.HBToutput = command;
            } else if (command.includes("*SSID")) {
                mqttMapping.SSIDoutput = command;
            } else if (command.includes("*PWD")) {
                mqttMapping.PWDoutput = command;
            } else if (command.includes("*SN")) {
                mqttMapping.SNoutput = command;
            } else if (command.includes("*ERASE")) {
                mqttMapping.ERASEoutput = command;
            } else if (command.includes("*SIP")) {
                mqttMapping.SIPoutput = command;
            }
            
            await mqttMapping.save();
        }
    } catch (error) {
        console.error('Error updating MqttMacMapping field:', error);
    }
};

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
            if(deviceConfig.Command.includes("*FW") && response.includes("Mobivend"))
            {
                deviceConfig.Response=response;
            }
            else if(deviceConfig.Command.includes("*SSID") && response.includes("SSID"))
            {
                deviceConfig.Response=response;
            }
            else if(deviceConfig.Command.includes("*URL") && response.includes("URL"))
            {
                deviceConfig.Response=response;
            }
            else if(deviceConfig.Command.includes("*FOTA") && response.includes("FOTA"))
            {
                deviceConfig.Response=response;
            }
            else if(deviceConfig.Command.includes("*RST") && response.includes("RST"))
            {
                deviceConfig.Response=response;
            }
            else if(deviceConfig.Command.includes("*QR") && response.includes("QR"))
            {
                deviceConfig.Response=response;
            }
            else if(deviceConfig.Command.includes("*RSSI") && response.includes("RSSI"))
            {
                deviceConfig.Response=response;
            }
            else if(deviceConfig.Command.includes("*HBT") && response.includes("HBT"))
            {
                deviceConfig.Response=response;
            }
            else if(deviceConfig.Command.includes("*SS") && response.includes("SS"))
            {
                deviceConfig.Response=response;
            }
            else if(deviceConfig.Command.includes("*SS1") && response.includes("SS1"))
            {
                deviceConfig.Response=response;
            }
            else if(deviceConfig.Command.includes("*SS2") && response.includes("SS2"))
            {
                deviceConfig.Response=response;
            }
           
            else if(deviceConfig.Command.includes("*PW") && response.includes("PW"))
            {
                deviceConfig.Response=response;
            }
           
          
            else if(deviceConfig.Command.includes("*PW1") && response.includes("PW1"))
            {
                deviceConfig.Response=response;
            }
            else if(deviceConfig.Command.includes("*PW2") && response.includes("PW2"))
            {
                deviceConfig.Response=response;
            }
          
            await deviceConfig.save();
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

module.exports = {
    parseMqttMessage,
    sendMqttCommand,
    updateMqttMappingField,
    getISTDateTime,
    getDateTime
}; 