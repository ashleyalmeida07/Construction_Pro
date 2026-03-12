const { Sequelize } = require('sequelize');
require('dotenv').config();

const isUrlConfig = Boolean(process.env.DATABASE_URL);

const sequelize = isUrlConfig
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'mysql',
      logging: false,
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3306', 10),
        dialect: 'mysql',
        logging: false,
      }
    );

module.exports = sequelize;
