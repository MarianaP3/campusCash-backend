const { DataTypes } = require('sequelize')
const { sequelize } = require('../database/config')
const { TYPES } = require('../constants')

const Type = sequelize.define('Type', {
  type: {
    type: DataTypes.ENUM(...Object.values(TYPES)),
    allowNull: false,
    primaryKey: true
  }
}, {
  tableName: 'Types',
  timestamps: false
})

module.exports = Type
