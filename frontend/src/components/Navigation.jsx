import React from 'react';

const Navigation = ({ activeTab, onTabChange }) => {
    return (
        <div style={{
            backgroundColor: '#f8f9fa',
            padding: '10px 20px',
            borderBottom: '1px solid #dee2e6',
            marginBottom: '20px',
            overflowX: 'auto'
        }}>
            <div style={{
                display: 'flex',
                gap: '10px',
                minWidth: 'max-content',
                flexWrap: 'nowrap'
            }}>
                {/* <button
                    onClick={() => onTabChange('kwikpay')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: activeTab === 'kwikpay' ? '#007bff' : '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'kwikpay' ? 'bold' : 'normal'
                    }}
                >
                    KwikPay Dashboard
                </button> */}
                <button
                    onClick={() => onTabChange('mqtt')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: activeTab === 'mqtt' ? '#007bff' : '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'mqtt' ? 'bold' : 'normal',
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                        minWidth: 'fit-content'
                    }}
                >
                   Device Configuration
                </button>
                <button
                    onClick={() => onTabChange('device-config')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: activeTab === 'device-config' ? '#007bff' : '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'device-config' ? 'bold' : 'normal',
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                        minWidth: 'fit-content'
                    }}
                >
                    Device Configuration Report
                </button>
                <button
                    onClick={() => onTabChange('mobivend-txns')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: activeTab === 'mobivend-txns' ? '#007bff' : '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'mobivend-txns' ? 'bold' : 'normal',
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                        minWidth: 'fit-content'
                    }}
                >
                    MobiVend Transactions
                </button>
                <button
                    onClick={() => onTabChange('mobivend-vendings')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: activeTab === 'mobivend-vendings' ? '#007bff' : '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'mobivend-vendings' ? 'bold' : 'normal',
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                        minWidth: 'fit-content'
                    }}
                >
                    MobiVend Vendings
                </button>
                <button
                    onClick={() => onTabChange('mobivend-devices')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: activeTab === 'mobivend-devices' ? '#007bff' : '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'mobivend-devices' ? 'bold' : 'normal',
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                        minWidth: 'fit-content'
                    }}
                >
                    MobiVend Devices
                </button>
                <button
                    onClick={() => onTabChange('mobivend-qrcodes')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: activeTab === 'mobivend-qrcodes' ? '#007bff' : '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'mobivend-qrcodes' ? 'bold' : 'normal',
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                        minWidth: 'fit-content'
                    }}
                >
                    MobiVend QR Codes
                </button>
                <button
                    onClick={() => onTabChange('mqtt-mac-mapping')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: activeTab === 'mqtt-mac-mapping' ? '#007bff' : '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'mqtt-mac-mapping' ? 'bold' : 'normal',
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                        minWidth: 'fit-content'
                    }}
                >
                    MQTT Mac Mappings
                </button>
                <button
                    onClick={() => onTabChange('city-client-sites')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: activeTab === 'city-client-sites' ? '#007bff' : '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: activeTab === 'city-client-sites' ? 'bold' : 'normal',
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                        minWidth: 'fit-content'
                    }}
                >
                    City Client Sites
                </button>
            </div>
        </div>
    );
};

export default Navigation; 