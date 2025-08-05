module.exports = (sequelize, DataTypes) => {
  const UserDeviceMapping = sequelize.define(
    'UserDeviceMapping',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'MqttDashboardUsers',
          key: 'id'
        },
        comment: 'Reference to DashboardUser'
      },
      deviceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'MqttMacMappings',
          key: 'id'
        },
        comment: 'Reference to MqttMacMapping device'
      },
      deviceType: {
        type: DataTypes.ENUM('mqtt', 'mobivend', 'kwikpay', 'other'),
        allowNull: false,
        defaultValue: 'mqtt',
        comment: 'Type of device being linked'
      },
      canView: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'User can view this device'
      },
      canControl: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'User can control this device'
      },
      canConfigure: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'User can configure this device'
      },
      isPrimary: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether this is the primary device for the user'
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Additional notes about this device-user relationship'
      }
    },
    {
      tableName: 'UserDeviceMappings',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['userId', 'deviceId', 'deviceType']
        },
        {
          fields: ['userId']
        },
        {
          fields: ['deviceId']
        },
        {
          fields: ['deviceType']
        }
      ]
    }
  );

  UserDeviceMapping.associate = function (models) {
    UserDeviceMapping.belongsTo(models.DashboardUser, {
      foreignKey: 'userId',
      as: 'user'
    });
    
    UserDeviceMapping.belongsTo(models.MqttMacMapping, {
      foreignKey: 'deviceId',
      as: 'device'
    });
  };

  return UserDeviceMapping;
}; 