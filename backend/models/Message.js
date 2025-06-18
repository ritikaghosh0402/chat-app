const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Message = sequelize.define('Message', {
  content: { type: DataTypes.TEXT, allowNull: false },
}, { timestamps: true });

Message.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Message, { foreignKey: 'userId' });

module.exports = Message;
