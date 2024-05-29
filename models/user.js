/* eslint-disable camelcase */
const { DataTypes } = require('sequelize')
const { sequelize } = require('../database/config')
const { ROLES } = require('../constants')

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  about_user: {
    type: DataTypes.TEXT
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ROLES.READER // Puedes definir el rol por defecto
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'User',
  timestamps: false // Deshabilitar timestamps si no los necesitas
})

module.exports = User
