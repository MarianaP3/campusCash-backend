const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('campuscash', 'root', '', {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false
})

const dbConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log('Base de datos online')
  } catch (error) {
    console.error('Error a la hora de iniciar la base de datos:', error)
    throw new Error('Error a la hora de iniciar la base de datos')
  }
}

module.exports = { sequelize, dbConnection }
