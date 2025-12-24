const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    cautionGiven: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    waiverGiven: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    ChaletId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});

module.exports = User;
