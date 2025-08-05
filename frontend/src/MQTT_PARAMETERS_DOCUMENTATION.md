# MQTT Parameters Documentation

## Overview
This document describes all the parameters that can be sent from `user-table-row.jsx` to the MQTT endpoint (`/mqtt/sendToMqtt`).

## 🔧 Updated sendToMqtt Function

### Function Signature
```javascript
sendToMqtt(serialNumber, message, additionalParams = {})
```

### All Available Parameters

| Parameter | Type | Required | Source | Description |
|-----------|------|----------|--------|-------------|
| `serialNumber` | string | ✅ Yes | `m.SNoutput` | Device serial number |
| `message` | string | ✅ Yes | Function parameter | MQTT command/message |
| `UserName` | string | ❌ No | `sessionStorage.getItem("name")` | User who sent the command |
| `EmailId` | string | ❌ No | `sessionStorage.getItem("email")` | User's email address |
| `MacId` | string | ❌ No | `m.MacID` | Device MAC address |
| `MachineId` | string | ❌ No | `m.SNoutput` | Machine identifier |

## 📊 Complete Request Object

```javascript
{
  "serialNumber": "DEVICE001",           // From m.SNoutput
  "message": "*FW?#",                    // MQTT command
  "UserName": "john_doe",                // From sessionStorage
  "EmailId": "john@example.com",         // From sessionStorage
  "MacId": "AA:BB:CC:DD:EE:FF",         // From m.MacID
  "MachineId": "DEVICE001"               // From m.SNoutput
}
```

## 🎯 Available MQTT Commands from user-table-row.jsx

### 1. Firmware Commands
```javascript
// Get firmware version
sendToMqttMessage("*FW?#")

// Firmware update
sendToMqttMessage(`*FOTA:${sessionStorage.getItem("name")}:${Date.now()}#`)
```

### 2. Network Configuration
```javascript
// Get SSID
sendToMqttMessage("*SSID?#")

// Set SSID
sendToMqttMessage(`*SS:${SSID}#`)

// Set SSID1
sendToMqttMessage(`*SS1:${SSID1}#`)

// Set SSID2
sendToMqttMessage(`*SS2:${SSID2}#`)

// Set Password
sendToMqttMessage(`*PW:${PWD}#`)

// Set Password1
sendToMqttMessage(`*PW1:${PWD1}#`)

// Set Password2
sendToMqttMessage(`*PW2:${PWD2}#`)
```

### 3. Device Control
```javascript
// Reset device
sendToMqttMessage("*RST#")

// Get URL
sendToMqttMessage("*URL?#")

// Set URL
sendToMqttMessage(`*URL:${url}#`)

// Get RSSI
sendToMqttMessage("*RSSI?#")
```

### 4. QR Code Operations
```javascript
// Get QR code
sendToMqttMessage("*QR?#")

// Set QR code
sendToMqttMessage(`*QR:${mobivendQrCodes.QrString}#`)
```

## 🔄 Enhanced Function with Response Handling

### Function Signature
```javascript
sendToMqttMessageWithResponse(message)
```

### Usage Example
```javascript
const response = await sendToMqttMessageWithResponse("*FW?#");
if (response.deviceConfigSaved) {
  console.log("Device config saved successfully");
}
```

## 📋 Data Sources in user-table-row.jsx

### From Component Props (`m` object)
- `m.SNoutput` → `serialNumber` and `MachineId`
- `m.MacID` → `MacId`

### From Session Storage
- `sessionStorage.getItem("name")` → `UserName`
- `sessionStorage.getItem("email")` → `EmailId`

### From Component State
- `SSID`, `SSID1`, `SSID2` → WiFi network names
- `PWD`, `PWD1`, `PWD2` → WiFi passwords
- `url` → Device URL
- `mobivendQrCodes.QrString` → QR code string

## 🚀 Backend Response Format

```javascript
{
  "status": 200,
  "message": "MQTT message sent successfully",
  "deviceConfigSaved": true,  // or false
  "serialNumber": "DEVICE001",
  "command": "*FW?#"
}
```

## ⚠️ Important Notes

1. **Backward Compatibility**: The original `sendToMqttMessage` function still works with just `serialNumber` and `message`
2. **Automatic User Info**: User information is automatically retrieved from sessionStorage
3. **Device Config Tracking**: All commands are automatically logged in the DeviceConfig table
4. **Error Handling**: Enhanced error handling with console logging
5. **Response Tracking**: New function provides response handling capabilities

## 🔧 Implementation Details

### Original Function (Still Available)
```javascript
const sendToMqttMessage = (message) => {
  sendToMqtt(m.SNoutput, message);
}
```

### Enhanced Function (Recommended)
```javascript
const sendToMqttMessage = (message) => {
  const deviceConfig = {
    UserName: sessionStorage.getItem("name") || "Unknown User",
    EmailId: sessionStorage.getItem("email") || "unknown@example.com",
    MacId: m.MacID || "",
    MachineId: m.SNoutput || ""
  };
  
  sendToMqtt(m.SNoutput, message, deviceConfig);
}
```

### Async Function with Response
```javascript
const sendToMqttMessageWithResponse = async (message) => {
  const deviceConfig = {
    UserName: sessionStorage.getItem("name") || "Unknown User",
    EmailId: sessionStorage.getItem("email") || "unknown@example.com",
    MacId: m.MacID || "",
    MachineId: m.SNoutput || ""
  };
  
  const response = await sendToMqttWithConfig(m.SNoutput, message, deviceConfig);
  return response;
}
```

## 📈 Benefits

1. **Complete Audit Trail**: All MQTT commands are logged with user information
2. **User Accountability**: Track who sent what command to which device
3. **Device Response Tracking**: Monitor device responses and update config records
4. **Enhanced Debugging**: Better error handling and logging
5. **Flexible Usage**: Multiple function options for different use cases 