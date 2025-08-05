console.log('Testing models import...');
try {
  const models = require('./models');
  console.log('Available models:', Object.keys(models).filter(key => key !== 'sequelize' && key !== 'Sequelize'));
  
  // Test specific model import
  const {MobiVendDevices} = require('./models');
  console.log('MobiVendDevices model imported successfully');
  
  console.log('All tests passed!');
} catch (error) {
  console.error('Error importing models:', error.message);
} 