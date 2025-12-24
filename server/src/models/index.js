const sequelize = require('../database');
const User = require('./User');
const Chalet = require('./Chalet');
const AllowedUser = require('./AllowedUser');

// Associations
Chalet.hasMany(User, { foreignKey: 'ChaletId', onDelete: 'SET NULL', hooks: true });
User.belongsTo(Chalet, { foreignKey: 'ChaletId', onDelete: 'SET NULL', hooks: true });

module.exports = {
    sequelize,
    User,
    Chalet,
    AllowedUser,
};
