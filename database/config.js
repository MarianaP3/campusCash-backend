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

const config = {
  jwtSecret: process.env.JWT_SECRET || 'mysecretkey', // Cambia 'mysecretkey' por una clave secreta segura
  jwtExpiresIn: '1h' // Opcional: define la duración del token
}

module.exports = {
  sequelize,
  dbConnection,
  config
}
