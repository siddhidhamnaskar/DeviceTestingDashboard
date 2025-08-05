const axios = require('axios');

async function testMobiVendAPI() {
  try {
    console.log('Testing MobiVend API...');
    
    // Test with proper JSON body
    const response = await axios.post('http://localhost:3000/mobivend/getAllMobiVendDevices', {
      serial: 'TEST123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
  } catch (error) {
    console.error('Error testing API:', error.response ? error.response.data : error.message);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testMobiVendAPI();
}

module.exports = { testMobiVendAPI }; 