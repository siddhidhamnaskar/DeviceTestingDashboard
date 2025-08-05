require('dotenv').config();

const x = {
  development: {
    username: process.env.DB_USER || 'siddhi',
    password: process.env.DB_PASS || 'Siddhi@2000',
    database: process.env.DB_NAME || 'snackboss',
    host: process.env.DB_HOST || '165.232.180.111',
    dialect: process.env.DB_DIALECT || 'mysql',
    port: process.env.DB_PORT || 3306,
    dialectOptions: {
      charset: 'utf8',
    },
    pool: {
      min: 0,
      max: 10,
      acquire: 30000,
      idle: 10000
    },
    logging: false
  },
  test: {
    username: process.env.DB_USER || 'siddhi',
    password: process.env.DB_PASS || 'Siddhi@2000',
    database: process.env.DB_NAME || 'snackboss',
    host: process.env.DB_HOST || '165.232.180.111',
    dialect: process.env.DB_DIALECT || 'mysql',
    port: process.env.DB_PORT || 3306,
    dialectOptions: {
      charset: 'utf8',
    },
    pool: {
      min: 0,
      max: 10,
      acquire: 30000,
      idle: 10000
    },
    logging: false
  },
  production: {
    username: process.env.DB_USER || 'siddhi',
    password: process.env.DB_PASS || 'Siddhi@2000',
    database: process.env.DB_NAME || 'snackboss',
    host: process.env.DB_HOST || '165.232.180.111',
    dialect: process.env.DB_DIALECT || 'mysql',
    port: process.env.DB_PORT || 3306,
    dialectOptions: {
      charset: 'utf8',
    },
    pool: {
      min: 0,
      max: 10,
      acquire: 30000,
      idle: 10000
    },
    logging: false
  },
};
module.exports = x;
