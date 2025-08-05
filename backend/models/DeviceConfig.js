module.exports = (sequelize, DataTypes) => {
  const DeviceConfig = sequelize.define(
    'DeviceConfig',
    {
      UserName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      EmailId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      MacId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      MachineId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Command: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      Response: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: 'DeviceConfig',
      timestamps: true
    }
  );

  DeviceConfig.associate = function (models) {
    // associations can be defined here
  };

  return DeviceConfig;
}; 