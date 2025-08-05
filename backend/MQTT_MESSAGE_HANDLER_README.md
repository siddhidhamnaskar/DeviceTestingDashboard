# MQTT Message Handler for MqttMacMapping

This system applies the data logic from `socketServer.js` to handle MQTT messages and store responses in the `MqttMacMapping` table.

## Overview

The MQTT message handling system consists of:

1. **MqttMacMapping Model** - Database table to store device mappings and responses
2. **MqttMacMapping Handler** - Processes incoming MQTT messages
3. **MQTT Operations Controller** - Provides API endpoints to send commands
4. **MQTT Routes** - REST API routes for MQTT operations

## Files Created/Modified

### New Files:
- `backend/helpers/mqttMacMappingHandler.js` - Main message processing logic
- `backend/controllers/MqttOperations/mqttCommands.js` - API controller functions
- `backend/routes/mqttOperations.js` - REST API routes
- `backend/migrations/250124_01_MqttMacMapping.js` - Database migration
- `backend/test-mqtt-handler.js` - Test script

### Modified Files:
- `backend/mqtt.js` - Updated to use new message handler
- `backend/app.js` - Added MQTT operations routes

## How It Works

### 1. Message Processing Flow

When an MQTT message is received:

1. **Message Reception**: MQTT client receives message on subscribed topic
2. **Parsing**: `mqttMacMappingHandler.parseMqttMessage()` processes the message
3. **Command Detection**: System identifies command type (MAC, HBT, SIP, etc.)
4. **Database Update**: Updates or creates `MqttMacMapping` record
5. **Response**: Sends appropriate response back to device
6. **Transaction Log**: Creates transaction record for audit trail

### 2. Command Types Supported

The system handles the same commands as `socketServer.js`:

- **MAC** - Device identification and registration
- **HBT** - Heartbeat messages
- **SIP** - Server IP configuration
- **FOTA** - Firmware over the air updates
- **RST** - Reset commands
- **FW** - Firmware queries
- **URL** - URL configuration
- **SSID/PWD** - WiFi configuration (Primary)
- **SSID1/PWD1** - WiFi configuration (Secondary)
- **SSID2/PWD2** - WiFi configuration (Tertiary)
- **SN** - Serial number operations
- **ERASE** - Memory erase operations
- **H1-H4** - Hardware control commands
- **FLASH/OFF/NEXT/AUTO/Q** - Device control commands
- **C1-C7** - Custom commands

### 3. Database Storage

Each command response is stored in the appropriate field in `MqttMacMapping`:

```javascript
{
  MacID: "DEVICE001",
  lastHeartBeatTime: "2024-01-25T10:30:00.000Z",
  SIPmessage: "*DEVICE001,SIP,192.168.1.100*",
  FotaMessage: "*DEVICE001,FOTA,UPDATE*",
  SSIDoutput: "*DEVICE001,SSID,MY_WIFI*",
  SSID1output: "*DEVICE001,SS1-OK*",
  SSID2output: "*DEVICE001,SS2-OK*",
  PWDoutput: "*DEVICE001,PW-OK*",
  PWD1output: "*DEVICE001,PW1-OK*",
  PWD2output: "*DEVICE001,PW2-OK*",
  // ... other fields
}
```

## API Endpoints

### Send Commands

- `POST /mqtt-operations/send-fota` - Send FOTA command
- `POST /mqtt-operations/send-reset` - Send reset command
- `POST /mqtt-operations/send-heartbeat` - Send heartbeat command
- `POST /mqtt-operations/send-firmware` - Send firmware query
- `POST /mqtt-operations/send-url` - Send URL configuration
- `POST /mqtt-operations/send-ssid` - Send SSID configuration
- `POST /mqtt-operations/send-password` - Send password configuration
- `POST /mqtt-operations/send-serial-number` - Send serial number
- `POST /mqtt-operations/send-custom-message` - Send custom message

### Get Data

- `GET /mqtt-operations/mqtt-mapping` - Get all MqttMacMapping records
- `GET /mqtt-operations/mqtt-mapping/:deviceId` - Get specific device mapping

## Example Usage

### Sending a Heartbeat Command

```javascript
// API call
POST /mqtt-operations/send-heartbeat
{
  "deviceId": "DEVICE001"
}

// Response
{
  "success": true,
  "message": "Heartbeat command sent successfully",
  "command": "*HBT#",
  "topic": "GVC/KP/DEVICE001"
}
```

### Processing Incoming Message

When device sends: `*DEVICE001,MAC,SN123456*`

1. System creates/updates MqttMacMapping record
2. Sends response: `*DATA:250124103000#`
3. Creates transaction record
4. Updates `lastHeartBeatTime`

## Testing

Run the test script to verify functionality:

```bash
cd backend
node test-mqtt-handler.js
```

## Configuration

Make sure your environment variables are set:

```env
MQTT_SERVER=your_mqtt_server
MQTT_PORT=your_mqtt_port
MQTT_USER_NAME=your_username
MQTT_PASSWORD=your_password
MQTT_TOPIC1=your_topic
```

## Migration

Run the database migration to create the MqttMacMapping table:

```bash
npx sequelize-cli db:migrate
```

## Key Features

1. **Automatic Device Registration**: Creates MqttMacMapping records for new devices
2. **Command Response Storage**: Stores all command responses in appropriate fields
3. **Transaction Logging**: Maintains audit trail of all commands
4. **Heartbeat Tracking**: Updates device heartbeat timestamps
5. **Message Cleanup**: Automatically clears temporary messages after timeout
6. **Error Handling**: Comprehensive error handling and logging
7. **Backward Compatibility**: Works alongside existing MQTT handler

## Integration with Existing System

The new system integrates seamlessly with the existing codebase:

- Uses existing MQTT client connection
- Maintains compatibility with existing `mqttHelper.parse()`
- Follows same patterns as `socketServer.js`
- Uses existing database models and transactions 