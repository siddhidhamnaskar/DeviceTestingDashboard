module.exports = (sequelize, DataTypes) => {
  const CityClientSite = sequelize.define(
    'CityClientSite',
    {
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      client: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      site: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      deviceType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      }
     
    },
    {
      tableName: 'CityClientSites',
      timestamps: true
    }
  );

  CityClientSite.associate = function (models) {
    // associations can be defined here
  };

  return CityClientSite;
}; 