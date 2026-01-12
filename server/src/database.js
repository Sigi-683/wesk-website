const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_PATH || path.join(__dirname, '../../database.sqlite'),
    logging: false, // Set to console.log to see SQL queries
    retry: {
        match: [
            /SQLITE_BUSY/,
        ],
        name: 'query',
        max: 5
    },
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    dialectOptions: {
        busyTimeout: 5000 // 5 seconds
    }
});

module.exports = sequelize;
