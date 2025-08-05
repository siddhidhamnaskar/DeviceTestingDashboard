

module.exports = (sequelize, DataTypes) => {
    const UnilineUsers = sequelize.define(
      'UnilineUsers',
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
        },
        isAdmin: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        verifyToken: {
          type: DataTypes.STRING,
          defaultValue: null,
        },
        isVerified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        City: {
          type: DataTypes.STRING,
          defaultValue: false,
        },
        Zone: {
          type: DataTypes.STRING,
          defaultValue: false,
        },
        Ward: {
          type: DataTypes.STRING,
          defaultValue: false,
        },
        Beat: {
          type: DataTypes.STRING,
          defaultValue: false,
        },
        clientName: {
          type: DataTypes.STRING,
          defaultValue: null,
        },
        superAdmin: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      
      },
      {
        defaultScope: {
          attributes: { exclude: ['password', 'verifyToken'] },
        },
        scopes: {
          withSecretColumns: {
            attributes: { include: ['password', 'verifyToken'] },
          },
        },
      },
    );
    UnilineUsers.associate = function (models) {
      // associations can be defined here
    };
    return UnilineUsers;
  };
  