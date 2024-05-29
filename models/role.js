const { DataTypes } = require('sequelize')
const { sequelize } = require('../database/config')
const { ROLES } = require('../constants')

const Role = sequelize.define('Role', {
  role: {
    type: DataTypes.ENUM(...Object.values(ROLES)),
    allowNull: false,
    primaryKey: true
  }
}, {
  tableName: 'Roles',
  timestamps: false
})

module.exports = Role

