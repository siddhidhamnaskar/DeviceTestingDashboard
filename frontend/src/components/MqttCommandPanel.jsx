import React, { useState } from 'react';
import { sendMqttCommand } from '../_mock/mqttApi';

const MqttCommandPanel = ({ selectedDevice, onCommandSent }) => {
    const [command, setCommand] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const predefinedCommands = [
        { label: 'Get Status', command: 'STATUS' },
        { label: 'Get Version', command: 'VERSION' },
        { label: 'Restart Device', command: 'RESTART' },
        { label: 'Get Config', command: 'CONFIG' },
        { label: 'Ping', command: 'PING' }
    ];

    const handleSendCommand = async () => {
        if (!selectedDevice || !command.trim()) {
            setMessage('Please select a device and enter a command');
            return;
        }

        try {
            setLoading(true);
            setMessage('');
            
            const result = await sendMqttCommand(selectedDevice.deviceId, command.trim());
            
            if (result.success) {
                setMessage('Command sent successfully!');
                setCommand('');
                if (onCommandSent) {
                    onCommandSent();
                }
            } else {
                setMessage(`Error: ${result.error || 'Failed to send command'}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handlePredefinedCommand = (cmd) => {
        setCommand(cmd);
    };

    if (!selectedDevice) {
        return (
            <div style={{
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                textAlign: 'center'
            }}>
                <p>Please select a device to send commands</p>
            </div>
        );
    }

    return (
        <div style={{
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: 'white'
        }}>
            <h3>Send Command to {selectedDevice.deviceName || selectedDevice.deviceId}</h3>
            
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Predefined Commands:
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {predefinedCommands.map((cmd, index) => (
                        <button
                            key={index}
                            onClick={() => handlePredefinedCommand(cmd.command)}
                            style={{
                                padding: '5px 10px',
                                backgroundColor: '#e9ecef',
                                border: '1px solid #ced4da',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            {cmd.label}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Custom Command:
                </label>
                <input
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="Enter command..."
                    style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                    }}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSendCommand();
                        }
                    }}
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <button
                    onClick={handleSendCommand}
                    disabled={loading || !command.trim()}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: loading ? '#6c757d' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '14px'
                    }}
                >
                    {loading ? 'Sending...' : 'Send Command'}
                </button>
            </div>

            {message && (
                <div style={{
                    padding: '10px',
                    backgroundColor: message.includes('Error') ? '#f8d7da' : '#d4edda',
                    color: message.includes('Error') ? '#721c24' : '#155724',
                    border: `1px solid ${message.includes('Error') ? '#f5c6cb' : '#c3e6cb'}`,
                    borderRadius: '4px',
                    fontSize: '14px'
                }}>
                    {message}
                </div>
            )}

            <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
                <p><strong>Device Info:</strong></p>
                <p>ID: {selectedDevice.deviceId}</p>
                <p>Status: {selectedDevice.status}</p>
                <p>Last Heartbeat: {selectedDevice.lastHeartbeat ? new Date(selectedDevice.lastHeartbeat).toLocaleString() : 'Never'}</p>
            </div>
        </div>
    );
};

export default MqttCommandPanel; 