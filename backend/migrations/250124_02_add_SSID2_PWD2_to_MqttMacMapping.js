module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('MqttMacMapping', 'SSID2output', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.addColumn('MqttMacMapping', 'PWD2output', {
        type: Sequelize.STRING,
        allowNull: true
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('MqttMacMapping', 'SSID2output'),
      queryInterface.removeColumn('MqttMacMapping', 'PWD2output')
    ]);
  }
}; 