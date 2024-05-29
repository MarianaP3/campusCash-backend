/* eslint-disable camelcase */
const { DataTypes } = require('sequelize')
const { sequelize } = require('../database/config')
const { CATEGORIES, TYPES } = require('../constants')

const Movement = sequelize.define('Movement', {
  movement_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  concept: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'user_id'
    }
  },
  categorie: {
    type: DataTypes.ENUM(...Object.values(CATEGORIES)),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM(...Object.values(TYPES)),
    allowNull: false
  }
}, {
  tableName: 'movement',
  timestamps: false
})

module.exports = Movement
