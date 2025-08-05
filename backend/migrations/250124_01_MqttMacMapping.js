module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('MqttMacMapping', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    UID: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    MacID: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    Location: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    City: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    SocketNumber: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    V1: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    V2: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    V3: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    V4: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    V5: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    V6: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    V7: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    lastHeartBeatTime: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    FotaMessage: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    RstMessage: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    FWoutput: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    FotaURLoutput: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    URLoutput: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    HBToutput: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    SIPoutput: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    SSIDoutput: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    SSIDmessage: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    PWDoutput: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    SSID1output: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    PWD1output: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    SNoutput: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    SNmessage: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    ERASEoutput: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    ERASEmessage: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    SIPmessage: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    H1message: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    H2message: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    H3message: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    H4message: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    FLASHmessage: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    OFFmessage: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    NEXTmessage: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    AUTOmessage: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    Qmessage: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    C1message: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    C2message: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    C3message: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    C4message: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    C5message: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    C6message: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    C7message: {
      defaultValue: null,
      type: Sequelize.STRING,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('MqttMacMapping'),
}; 