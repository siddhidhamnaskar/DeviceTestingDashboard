module.exports = (sequelize, DataTypes) => {
  const UserServiceMapping = sequelize.define(
    'UserServiceMapping',
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
      city: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'City filter for the user access'
      },
      site: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Site filter for the user access'
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Category filter for the user access'
      },
      canView: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether user can view services'
      },
      canEdit: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether user can edit services'
      },
      canDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether user can delete services'
      },
      canCreate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether user can create new services'
      }
    },
    {
      tableName: 'UserServiceMappings',
      timestamps: true,
      indexes: [
        {
          fields: ['userId']
        },
        {
          fields: ['city']
        },
        {
          fields: ['site']
        },
        {
          fields: ['category']
        }
      ]
    }
  );

  UserServiceMapping.associate = function (models) {
    UserServiceMapping.belongsTo(models.DashboardUser, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return UserServiceMapping;
}; 