const { DataTypes } = require('sequelize')
const { sequelize } = require('../database/config')
const { TOPICS } = require('../constants')

const Topic = sequelize.define('Topic', {
  topic: {
    type: DataTypes.ENUM(...Object.values(TOPICS)),
    allowNull: false,
    primaryKey: true
  }
}, {
  tableName: 'Topics',
  timestamps: false
})

module.exports = Topic
