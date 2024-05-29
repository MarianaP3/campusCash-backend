/* eslint-disable camelcase */
const { response, request } = require('express')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
  const { name, email, password } = req.body

  console.log('Datos recibidos:', { name, email, password })

  try {
    // Verificar si el usuario ya existe en la base de datos
    const usuarioExistente = await Usuario.findOne({ where: { email } })
    console.log('Usuario existente:', usuarioExistente)

    if (usuarioExistente) {
      return res.status(400).json({ msg: 'El usuario ya está registrado' })
    }

    // Verificar el dominio del correo electrónico y asignar el rol
    let role
    if (email.endsWith('@alumnos.uaslp.mx')) {
      role = ROLES.EDITOR
    } else {
      role = ROLES.STUDENT
    }

    console.log('Rol:', { role })

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync()
    const hashedPassword = bcryptjs.hashSync(password, salt)

    // Crear el usuario en la base de datos
    const nuevoUsuario = await Usuario.create({
      name,
      email,
      password: hashedPassword,
      role
    })

    // Generar el token de autenticación para el nuevo usuario
    const token = jwt.sign({ user_id: nuevoUsuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' })

    console.log('Token: ', { token })

    // Devolver la respuesta con el usuario y el token
    res.json({ usuario: token })
  } catch (error) {
    console.error('Error al verificar o crear usuario:', error)
    res.status(500).json({ msg: 'Error interno del servidor' })
  }
}

async function signin (req, res = response) {
  const { email, password } = req.body

  console.log('Datos de inicio de sesión:', { email, password })

  try {
    // Verificar si el usuario existe en la base de datos
    const usuario = await Usuario.findOne({ where: { email } })

    if (!usuario) {
      return res.status(400).json({
        msg: 'El usuario no está registrado'
      })
    }

    // Verificar si la contraseña es correcta
    const passwordMatch = await bcryptjs.compare(password, usuario.password)

    if (!passwordMatch) {
      return res.status(400).json({
        msg: 'La contraseña proporcionada es incorrecta'
      })
    }

    // Si el usuario existe y la contraseña es correcta, generar token de autenticación
    console.log('Se está generando el token con el usuario', usuario.user_id)
    const token = jwt.sign({ user_id: usuario.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' })

    console.log('Token: ', { token })

    res.json({
      token
    })
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    res.status(500).json({
      msg: 'Error interno del servidor'
    })
  }
}

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
  activateUsers,
  signin
}
