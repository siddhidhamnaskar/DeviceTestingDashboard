const mqttMacMappingHandler = require('./helpers/mqttMacMappingHandler');
const { MqttMacMapping } = require('./models');

// Mock MQTT client for testing
const mockMqttClient = {
    publish: (topic, message) => {
        console.log(`Mock MQTT publish - Topic: ${topic}, Message: ${message}`);
    }
};

// Test function to simulate MQTT message processing
async function testMqttMessageHandling() {
    console.log('=== Testing MQTT Message Handler ===\n');
    
    try {
        // Test 1: MAC command
        console.log('Test 1: Processing MAC command');
        const macPayload = Buffer.from('*DEVICE001,MAC,SN123456*');
        await mqttMacMappingHandler.parseMqttMessage(macPayload, mockMqttClient, 'GVC/KP/DEVICE001');
        
        // Test 2: HBT command
        console.log('\nTest 2: Processing HBT command');
        const hbtPayload = Buffer.from('*DEVICE001,HBT*');
        await mqttMacMappingHandler.parseMqttMessage(hbtPayload, mockMqttClient, 'GVC/KP/DEVICE001');
        
        // Test 3: SIP command
        console.log('\nTest 3: Processing SIP command');
        const sipPayload = Buffer.from('*DEVICE001,SIP,192.168.1.100*');
        await mqttMacMappingHandler.parseMqttMessage(sipPayload, mockMqttClient, 'GVC/KP/DEVICE001');
        
        // Test 4: FOTA command
        console.log('\nTest 4: Processing FOTA command');
        const fotaPayload = Buffer.from('*DEVICE001,FOTA,UPDATE*');
        await mqttMacMappingHandler.parseMqttMessage(fotaPayload, mockMqttClient, 'GVC/KP/DEVICE001');
        
        // Test 5: SSID command
        console.log('\nTest 5: Processing SSID command');
        const ssidPayload = Buffer.from('*DEVICE001,SSID,MY_WIFI*');
        await mqttMacMappingHandler.parseMqttMessage(ssidPayload, mockMqttClient, 'GVC/KP/DEVICE001');
        
        // Test 5.1: SSID2 command
        console.log('\nTest 5.1: Processing SSID2 command');
        const ssid2Payload = Buffer.from('*DEVICE001,SS2-OK*');
        await mqttMacMappingHandler.parseMqttMessage(ssid2Payload, mockMqttClient, 'GVC/KP/DEVICE001');
        
        // Test 5.2: PWD2 command
        console.log('\nTest 5.2: Processing PWD2 command');
        const pwd2Payload = Buffer.from('*DEVICE001,PW2-OK*');
        await mqttMacMappingHandler.parseMqttMessage(pwd2Payload, mockMqttClient, 'GVC/KP/DEVICE001');
        
        // Test 6: Send MQTT command
        console.log('\nTest 6: Sending MQTT command');
        mqttMacMappingHandler.sendMqttCommand(mockMqttClient, 'GVC/KP/DEVICE001', '*HBT#', 'DEVICE001');
        
        // Test 7: Retrieve MqttMacMapping data
        console.log('\nTest 7: Retrieving MqttMacMapping data');
        const mappings = await MqttMacMapping.findAll({
            where: { MacID: 'DEVICE001' }
        });
        
        console.log('MqttMacMapping records found:', mappings.length);
        if (mappings.length > 0) {
            console.log('Latest record:', {
                MacID: mappings[0].MacID,
                SNoutput: mappings[0].SNoutput,
                lastHeartBeatTime: mappings[0].lastHeartBeatTime,
                SIPmessage: mappings[0].SIPmessage,
                FotaMessage: mappings[0].FotaMessage,
                SSIDoutput: mappings[0].SSIDoutput,
                SSID2output: mappings[0].SSID2output,
                PWD2output: mappings[0].PWD2output
            });
        }
        
        console.log('\n=== Test completed successfully ===');
        
    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Function to test sending commands via the controller functions
async function testControllerFunctions() {
    console.log('\n=== Testing Controller Functions ===\n');
    
    try {
        // Mock request and response objects
        const mockReq = {
            body: {
                deviceId: 'DEVICE001',
                name: 'test-server'
            },
            app: {
                locals: {
                    mqttClient: mockMqttClient
                }
            }
        };
        
        const mockRes = {
            json: (data) => {
                console.log('Response:', data);
            },
            status: (code) => {
                console.log('Status code:', code);
                return {
                    json: (data) => {
                        console.log('Error response:', data);
                    }
                };
            }
        };
        
        // Import controller functions
        const mqttCommands = require('./controllers/MqttOperations/mqttCommands');
        
        // Test sending different commands
        console.log('Testing sendHeartbeat...');
        await mqttCommands.sendHeartbeat(mockReq, mockRes);
        
        console.log('\nTesting sendReset...');
        await mqttCommands.sendReset(mockReq, mockRes);
        
        console.log('\nTesting sendFirmware...');
        await mqttCommands.sendFirmware(mockReq, mockRes);
        
        console.log('\n=== Controller tests completed ===');
        
    } catch (error) {
        console.error('Controller test failed:', error);
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    testMqttMessageHandling()
        .then(() => testControllerFunctions())
        .then(() => {
            console.log('\nAll tests completed!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Test execution failed:', error);
            process.exit(1);
        });
}

module.exports = {
    testMqttMessageHandling,
    testControllerFunctions
}; 