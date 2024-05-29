/* eslint-disable camelcase */
const { response, request } = require('express')
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/user')
const { ROLES } = require('../constants')

const usuariosGet = async (req = request, res = response) => {
  const { limit = 5, since = 0 } = req.query
  const query = { status: true }

  const [total, usuarios] = await Promise.all([
    // It runs simultaneously
    Usuario.countDocuments(query),
    Usuario.find(query)
      .skip(since)
      .limit(limit)
  ])

  res.json({
    total,
    usuarios
  })
}

const getAuthorInfo = async (req = request, res = response) => {
  // find an author by their id
  // const { id } = req.params
  const { __id, name, last_name, about_user/* , ...resto */ } = req.body

  // extracts a fragment of about 300 characters of "about user" information
  const aboutUserFragment = about_user.substring(0, 300)

  res.json({
    __id,
    name,
    last_name,
    about_user: aboutUserFragment
  })
}

async function usuariosPost (req, res = response) {
  const {
    name,
    email,
    password
  } = req.body

  console.log('Datos recibidos:', { name, email, password })

  // Verificar si el usuario ya existe en la base de datos
  try {
    const usuarioExistente = await Usuario.findOne({ where: { email } })
    console.log('Usuario existente:', usuarioExistente)

    if (usuarioExistente) {
      return res.status(400).json({
        msg: 'El usuario ya está registrado'
      })
    }

    // Verificar el dominio del correo electrónico
    let role
    if (email.endsWith('@alumnos.uaslp.mx')) {
      role = ROLES.EDITOR
    } else {
      role = ROLES.STUDENT // O cualquier otro rol por defecto que prefieras
    }

    console.log('Rol:', { role })

    const usuario = new Usuario({
      name,
      email,
      password,
      role // Asigna el rol determinado
    })

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync(password, salt)

    // Guardar en la base de datos
    await usuario.save()

    res.json({
      usuario
    })
  } catch (error) {
    console.error('Error al verificar o crear usuario:', error)
    res.status(500).json({
      msg: 'Error interno del servidor'
    })
  }
}

/* async function signin (req, res = response) {
  const {
    email,
    password
  } = req.body
} */

const usuariosPut = async (req, res = response) => {
  const { id } = req.params
  const { _id, password, ...resto } = req.body

  // Validate the passsword against the database
  if (password) {
    // Encrypt the password
    const salt = bcryptjs.genSaltSync()
    resto.password = bcryptjs.hashSync(password, salt)
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto)

  res.json(usuario)
}

const usuariosDelete = async (req, res = response) => {
  const { id } = req.params
  // It uses SOFT delete due to the established terms
  const usuario = await Usuario.findByIdAndUpdate(id, { status: false })

  res.json(usuario)
}

const deactivateUsers = async (req, res = response) => {
  try {
    await Usuario.collection.updateMany({}, { $set: { status: false } })
    res.json('Usuarios desactivados')
  } catch (error) {
    res.json('No se pudieron desactivar los usuarios')
  }
}

const activateUsers = async (req, res = response) => {
  try {
    await Usuario.collection.updateMany({}, { $set: { status: true } })
    res.json('Usuarios activados')
  } catch (error) {
    res.json('No se pudieron activar los usuarios')
  }
}

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
  getAuthorInfo,
  deactivateUsers,
  activateUsers
}
