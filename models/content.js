/* eslint-disable camelcase */
const { DataTypes } = require('sequelize')
const { sequelize } = require('../database/config')
const { TOPICS } = require('../constants')

const Content = sequelize.define('Content', {
  content_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING
  },
  topic_id: {
    type: DataTypes.ENUM(...Object.values(TOPICS)),
    allowNull: false
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // Nombre de la tabla de usuarios
      key: 'id'
    }
  }
}, {
  tableName: 'Content',
  timestamps: false // Deshabilitar timestamps si no los necesitas
})

module.exports = Content
