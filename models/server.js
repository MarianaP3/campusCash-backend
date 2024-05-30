const express = require('express')
const cors = require('cors')
require('dotenv').config() // Esto cargará las variables definidas en tu archivo .env
const { dbConnection } = require('../database/config')

class Server {
  constructor () {
    this.app = express()
    this.port = process.env.PORT || 3000
    this.usuariosPath = '/api/usuarios'
    this.contenidosPath = '/api/contenidos'
    this.movimientosPath = '/api/movimientos'

    // Conectar a la base de datos
    this.conectarDB()

    // Middlewares
    this.middlewares()

    // Routes of the app
    this.routes()
  }

  async conectarDB () {
    await dbConnection()
  }

  middlewares () {
    // CORS
    this.app.use(cors())

    // Lecture of the body
    this.app.use(express.json())

    // Public directory
    this.app.use(express.static('public'))
  }

  routes () {
    this.app.use(this.usuariosPath, require('../routes/users'))
    this.app.use(this.contenidosPath, require('../routes/contents'))
    this.app.use(this.movimientosPath, require('../routes/movements'))
  }

  listen () {
    this.app.listen(this.port, () => {
      console.log('Running server on port', this.port)
    })
  }
}

module.exports = Server
