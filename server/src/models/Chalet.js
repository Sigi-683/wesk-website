const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Chalet = sequelize.define('Chalet', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    capacity: {
        type: DataTypes.INTEGER,
        defaultValue: 6,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

module.exports = Chalet;
