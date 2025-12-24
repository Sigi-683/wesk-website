const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const AllowedUser = sequelize.define('AllowedUser', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ticketType: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

module.exports = AllowedUser;
