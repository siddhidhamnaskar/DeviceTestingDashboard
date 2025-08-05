const API = process.env.REACT_APP_API;

// Get all MQTT devices
export const getAllMqttDevices = async () => {
    try {
        const headers = new Headers({
            'x-token': sessionStorage.getItem('token'),
        });

        const response = await fetch(`${API}/mqtt/devices`, { method: 'GET', headers });
        const json = await response.json();
        return json.data;
    } catch (error) {
        console.error('Error fetching MQTT devices:', error);
        return [];
    }
};

// Send MQTT command to device
export const sendMqttCommand = async (deviceId, command) => {
    try {
        const headers = new Headers({
            'x-token': sessionStorage.getItem('token'),
            'Content-Type': 'application/json',
        });

        const response = await fetch(`${API}/kwikpay/sendCommand`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                macId: deviceId,
                command: command
            })
        });
        
        const json = await response.json();
        return json;
    } catch (error) {
        console.error('Error sending MQTT command:', error);
        return { success: false, error: error.message };
    }
};

// Get device by ID
export const getMqttDeviceById = async (deviceId) => {
    try {
        const headers = new Headers({
            'x-token': sessionStorage.getItem('token'),
        });

        const response = await fetch(`${API}/mqtt/devices/${deviceId}`, { method: 'GET', headers });
        const json = await response.json();
        return json.data;
    } catch (error) {
        console.error('Error fetching device:', error);
        return null;
    }
};

// Get device transactions
export const getDeviceTransactions = async (deviceId, page = 1, limit = 20, type = null) => {
    try {
        const headers = new Headers({
            'x-token': sessionStorage.getItem('token'),
        });

        let url = `${API}/mqtt/devices/${deviceId}/transactions?page=${page}&limit=${limit}`;
        if (type) {
            url += `&type=${type}`;
        }

        const response = await fetch(url, { method: 'GET', headers });
        const json = await response.json();
        return json;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return { data: [], pagination: {} };
    }
};

// Get device status
export const getDeviceStatus = async (deviceId) => {
    try {
        const headers = new Headers({
            'x-token': sessionStorage.getItem('token'),
        });

        const response = await fetch(`${API}/mqtt/devices/${deviceId}/status`, { method: 'GET', headers });
        const json = await response.json();
        return json.data;
    } catch (error) {
        console.error('Error fetching device status:', error);
        return null;
    }
};

// Update device information
export const updateDevice = async (deviceId, updateData) => {
    try {
        const headers = new Headers({
            'x-token': sessionStorage.getItem('token'),
            'Content-Type': 'application/json',
        });

        const response = await fetch(`${API}/mqtt/devices/${deviceId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(updateData)
        });
        const json = await response.json();
        return json;
    } catch (error) {
        console.error('Error updating device:', error);
        return { error: 'Failed to update device' };
    }
};

// Get transaction statistics
export const getTransactionStats = async (deviceId, startDate = null, endDate = null) => {
    try {
        const headers = new Headers({
            'x-token': sessionStorage.getItem('token'),
        });

        let url = `${API}/mqtt/devices/${deviceId}/stats`;
        if (startDate && endDate) {
            url += `?startDate=${startDate}&endDate=${endDate}`;
        }

        const response = await fetch(url, { method: 'GET', headers });
        const json = await response.json();
        return json.data;
    } catch (error) {
        console.error('Error fetching transaction stats:', error);
        return [];
    }
};

// Get recent transactions
export const getRecentTransactions = async (limit = 50) => {
    try {
        const headers = new Headers({
            'x-token': sessionStorage.getItem('token'),
        });

        const response = await fetch(`${API}/mqtt/transactions/recent?limit=${limit}`, { method: 'GET', headers });
        const json = await response.json();
        return json.data;
    } catch (error) {
        console.error('Error fetching recent transactions:', error);
        return [];
    }
};

// Get online devices count
export const getOnlineDevicesCount = async () => {
    try {
        const headers = new Headers({
            'x-token': sessionStorage.getItem('token'),
        });

        const response = await fetch(`${API}/mqtt/devices/count`, { method: 'GET', headers });
        const json = await response.json();
        return json.data;
    } catch (error) {
        console.error('Error fetching device count:', error);
        return { online: 0, total: 0, offline: 0 };
    }
};

// Search devices
export const searchDevices = async (query = '', status = '', city = '') => {
    try {
        const headers = new Headers({
            'x-token': sessionStorage.getItem('token'),
        });

        let url = `${API}/mqtt/devices/search?`;
        const params = new URLSearchParams();
        
        if (query) params.append('query', query);
        if (status) params.append('status', status);
        if (city) params.append('city', city);
        
        url += params.toString();

        const response = await fetch(url, { method: 'GET', headers });
        const json = await response.json();
        return json.data;
    } catch (error) {
        console.error('Error searching devices:', error);
        return [];
    }
};

// Real-time device status monitoring
export const startDeviceMonitoring = (deviceId, callback) => {
    const interval = setInterval(async () => {
        try {
            const status = await getDeviceStatus(deviceId);
            if (status && callback) {
                callback(status);
            }
        } catch (error) {
            console.error('Error in device monitoring:', error);
        }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval); // Return cleanup function
};

// Get device connection status
export const getDeviceConnectionStatus = (lastHeartbeat) => {
    if (!lastHeartbeat) return 'offline';
    
    const now = new Date();
    const heartbeat = new Date(lastHeartbeat);
    const diffInMinutes = (now - heartbeat) / (1000 * 60);
    
    if (diffInMinutes < 1) return 'online';
    if (diffInMinutes < 5) return 'warning';
    return 'offline';
};

// Format timestamp for display
export const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = (now - date) / (1000 * 60);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
};

// Get transaction type color for UI
export const getTransactionTypeColor = (type) => {
    switch (type) {
        case 'command': return '#007bff';
        case 'response': return '#28a745';
        case 'status': return '#ffc107';
        case 'error': return '#dc3545';
        default: return '#6c757d';
    }
};

// Get status color for UI
export const getStatusColor = (status) => {
    switch (status) {
        case 'online': return '#28a745';
        case 'offline': return '#dc3545';
        case 'warning': return '#ffc107';
        case 'error': return '#dc3545';
        default: return '#6c757d';
    }
}; 