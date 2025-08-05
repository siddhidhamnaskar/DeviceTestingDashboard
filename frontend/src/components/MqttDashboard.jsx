import React, { useState, useEffect } from 'react';
import {
    getAllMqttDevices,
    getDeviceTransactions,
    getDeviceStatus,
    getOnlineDevicesCount,
    searchDevices,
    getDeviceConnectionStatus,
    formatTimestamp,
    getStatusColor,
    getTransactionTypeColor,
    startDeviceMonitoring
} from '../_mock/mqttApi';
import MqttCommandPanel from './MqttCommandPanel';

const MqttDashboard = () => {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [deviceCount, setDeviceCount] = useState({ online: 0, total: 0, offline: 0 });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        loadDevices();
        loadDeviceCount();
        const interval = setInterval(() => {
            loadDevices();
            loadDeviceCount();
        }, 30000); // Refresh every 30 seconds

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedDevice) {
            loadDeviceTransactions(selectedDevice.deviceId);
            // Start monitoring for this device
            const cleanup = startDeviceMonitoring(selectedDevice.deviceId, (status) => {
                setSelectedDevice(prev => ({ ...prev, ...status }));
            });
            return cleanup;
        }
    }, [selectedDevice]);

    const loadDevices = async () => {
        try {
            setLoading(true);
            const data = await getAllMqttDevices();
            setDevices(data);
        } catch (error) {
            console.error('Error loading devices:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadDeviceCount = async () => {
        try {
            const count = await getOnlineDevicesCount();
            setDeviceCount(count);
        } catch (error) {
            console.error('Error loading device count:', error);
        }
    };

    const loadDeviceTransactions = async (deviceId, page = 1) => {
        try {
            const data = await getDeviceTransactions(deviceId, page, 20);
            setTransactions(data.data || []);
        } catch (error) {
            console.error('Error loading transactions:', error);
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            const data = await searchDevices(searchQuery, statusFilter);
            setDevices(data);
        } catch (error) {
            console.error('Error searching devices:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeviceSelect = (device) => {
        setSelectedDevice(device);
    };

    const handleCommandSent = () => {
        // Refresh transactions after command is sent
        if (selectedDevice) {
            loadDeviceTransactions(selectedDevice.deviceId);
        }
    };

    const getStatusBadge = (status) => {
        const color = getStatusColor(status);
        return (
            <span style={{
                backgroundColor: color,
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
            }}>
                {status.toUpperCase()}
            </span>
        );
    };

    const getTransactionTypeBadge = (type) => {
        const color = getTransactionTypeColor(type);
        return (
            <span style={{
                backgroundColor: color,
                color: 'white',
                padding: '2px 6px',
                borderRadius: '8px',
                fontSize: '10px',
                fontWeight: 'bold'
            }}>
                {type.toUpperCase()}
            </span>
        );
    };

    if (loading && devices.length === 0) {
        return <div className="loading">Loading devices...</div>;
    }

    return (
        <div className="mqtt-dashboard" style={{ padding: '20px' }}>
            <div className="dashboard-header" style={{ marginBottom: '20px' }}>
                <h1>MQTT Device Dashboard</h1>
                <div className="device-stats" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div className="stat-card" style={{ 
                        padding: '15px', 
                        backgroundColor: '#28a745', 
                        color: 'white', 
                        borderRadius: '8px',
                        minWidth: '120px'
                    }}>
                        <h3>{deviceCount.online}</h3>
                        <p>Online</p>
                    </div>
                    <div className="stat-card" style={{ 
                        padding: '15px', 
                        backgroundColor: '#dc3545', 
                        color: 'white', 
                        borderRadius: '8px',
                        minWidth: '120px'
                    }}>
                        <h3>{deviceCount.offline}</h3>
                        <p>Offline</p>
                    </div>
                    <div className="stat-card" style={{ 
                        padding: '15px', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        borderRadius: '8px',
                        minWidth: '120px'
                    }}>
                        <h3>{deviceCount.total}</h3>
                        <p>Total</p>
                    </div>
                </div>
            </div>

            <div className="search-section" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Search devices..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                        <option value="">All Status</option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="error">Error</option>
                    </select>
                    <button 
                        onClick={handleSearch}
                        style={{ 
                            padding: '8px 16px', 
                            backgroundColor: '#007bff', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Search
                    </button>
                    <button 
                        onClick={loadDevices}
                        style={{ 
                            padding: '8px 16px', 
                            backgroundColor: '#6c757d', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Refresh
                    </button>
                </div>
            </div>

            <div className="dashboard-content" style={{ display: 'flex', gap: '20px' }}>
                <div className="devices-list" style={{ flex: 1 }}>
                    <h2>Devices ({devices.length})</h2>
                    <div className="devices-container" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        {devices.map((device) => (
                            <div
                                key={device.deviceId}
                                onClick={() => handleDeviceSelect(device)}
                                style={{
                                    padding: '15px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    marginBottom: '10px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedDevice?.deviceId === device.deviceId ? '#f8f9fa' : 'white',
                                    borderLeft: `4px solid ${getStatusColor(device.status)}`
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 5px 0' }}>{device.deviceName || device.deviceId}</h4>
                                        <p style={{ margin: '0', color: '#666', fontSize: '12px' }}>
                                            ID: {device.deviceId}
                                        </p>
                                        {device.location && (
                                            <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '12px' }}>
                                                📍 {device.location}
                                            </p>
                                        )}
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        {getStatusBadge(device.status)}
                                        <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: '#666' }}>
                                            {formatTimestamp(device.lastHeartbeat)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="device-details" style={{ flex: 1 }}>
                    {selectedDevice ? (
                        <>
                            <h2>Device Details</h2>
                            <div className="device-info" style={{ 
                                padding: '20px', 
                                border: '1px solid #ddd', 
                                borderRadius: '8px',
                                marginBottom: '20px'
                            }}>
                                <h3>{selectedDevice.deviceName || selectedDevice.deviceId}</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                                    <div>
                                        <strong>Device ID:</strong> {selectedDevice.deviceId}
                                    </div>
                                    <div>
                                        <strong>Status:</strong> {getStatusBadge(selectedDevice.status)}
                                    </div>
                                    <div>
                                        <strong>MAC Address:</strong> {selectedDevice.macAddress || 'N/A'}
                                    </div>
                                    <div>
                                        <strong>Serial Number:</strong> {selectedDevice.serialNumber || 'N/A'}
                                    </div>
                                    <div>
                                        <strong>Location:</strong> {selectedDevice.location || 'N/A'}
                                    </div>
                                    <div>
                                        <strong>City:</strong> {selectedDevice.city || 'N/A'}
                                    </div>
                                    <div>
                                        <strong>Last Heartbeat:</strong> {formatTimestamp(selectedDevice.lastHeartbeat)}
                                    </div>
                                    <div>
                                        <strong>Firmware:</strong> {selectedDevice.firmwareVersion || 'N/A'}
                                    </div>
                                </div>
                                
                                {selectedDevice.lastCommand && (
                                    <div style={{ marginBottom: '10px' }}>
                                        <strong>Last Command:</strong>
                                        <div style={{ 
                                            backgroundColor: '#f8f9fa', 
                                            padding: '10px', 
                                            borderRadius: '4px',
                                            fontFamily: 'monospace',
                                            fontSize: '12px'
                                        }}>
                                            {selectedDevice.lastCommand}
                                        </div>
                                    </div>
                                )}
                                
                                {selectedDevice.lastResponse && (
                                    <div>
                                        <strong>Last Response:</strong>
                                        <div style={{ 
                                            backgroundColor: '#f8f9fa', 
                                            padding: '10px', 
                                            borderRadius: '4px',
                                            fontFamily: 'monospace',
                                            fontSize: '12px'
                                        }}>
                                            {selectedDevice.lastResponse}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <MqttCommandPanel 
                                selectedDevice={selectedDevice} 
                                onCommandSent={handleCommandSent}
                            />

                            <h3 style={{ marginTop: '20px' }}>Recent Transactions</h3>
                            <div className="transactions-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {transactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        style={{
                                            padding: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            marginBottom: '8px',
                                            backgroundColor: 'white'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                {getTransactionTypeBadge(transaction.transactionType)}
                                                <span style={{ fontSize: '12px', color: '#666' }}>
                                                    {formatTimestamp(transaction.timestamp)}
                                                </span>
                                            </div>
                                            <span style={{ 
                                                fontSize: '11px', 
                                                color: transaction.status === 'failed' ? '#dc3545' : '#28a745'
                                            }}>
                                                {transaction.status.toUpperCase()}
                                            </span>
                                        </div>
                                        {transaction.command && (
                                            <div style={{ marginBottom: '5px' }}>
                                                <strong>Command:</strong>
                                                <div style={{ 
                                                    backgroundColor: '#f8f9fa', 
                                                    padding: '5px', 
                                                    borderRadius: '2px',
                                                    fontFamily: 'monospace',
                                                    fontSize: '11px'
                                                }}>
                                                    {transaction.command}
                                                </div>
                                            </div>
                                        )}
                                        {transaction.response && (
                                            <div>
                                                <strong>Response:</strong>
                                                <div style={{ 
                                                    backgroundColor: '#f8f9fa', 
                                                    padding: '5px', 
                                                    borderRadius: '2px',
                                                    fontFamily: 'monospace',
                                                    fontSize: '11px'
                                                }}>
                                                    {transaction.response}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div style={{
                            padding: '20px',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            backgroundColor: '#f8f9fa',
                            textAlign: 'center'
                        }}>
                            <p>Please select a device to view details and send commands</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MqttDashboard; 