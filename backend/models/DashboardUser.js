module.exports = (sequelize, DataTypes) => {
  const DashboardUser = sequelize.define(
    'DashboardUser',
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether the user has admin privileges'
      },
      isSuperAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether the user has super admin privileges'
      }
    },
    {
      tableName: 'MqttDashboardUsers',
      timestamps: true
    }
  );

  DashboardUser.associate = function (models) {
    // associations can be defined here
  };

  return DashboardUser;
}; 