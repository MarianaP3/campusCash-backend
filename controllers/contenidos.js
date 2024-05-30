/* eslint-disable camelcase */
const { response, request } = require('express')
const jwt = require('jsonwebtoken')

const Contenido = require('../models/content')

// GET METHODS
const contentsGet = async (req = request, res = response) => {
  const token = req.headers.authorization

  console.log('Token recibido en el back: ', { token })

  if (!token) {
    return res.status(401).json({ msg: 'No token provided' })
  }

  // const decoded = jwt.verify(token, process.env.JWT_SECRET) // Verificar y decodificar el token
  // const user_id = decoded.user_id // Obtener el user_id del token decodificado

  try {
    const movements = await Contenido.findAll()
    console.log(movements)
    res.json(movements)
  } catch (error) {
    console.error('Error al obtener los movimientos:', error)
    res.status(500).json({ msg: 'Error interno del servidor' })
  }
}

const getContentHiglight = async (req = request, res = response) => {
  // find a content by their id
  // const { id } = req.params
  const { __id, image, title, content/*, ...resto */ } = req.body

  // extracts a frament of about 50 characters of "content"
  const contentFragment = content.substring(0, 50)

  res.json({
    __id,
    title,
    image,
    content: contentFragment
  })
}

async function contentsPost (req, res = response) {
  const {
    title,
    content,
    image
  } = req.body

  const token = req.headers.authorization
  console.log('Token recibido en el back: ', { token })

  if (!token) {
    return res.status(401).json({ msg: 'No token provided' })
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET) // Verificar y decodificar el token
  const user_id = decoded.user_id // Obtener el user_id del token decodificado

  const contenido = new Contenido({
    title,
    content,
    image,
    user_id,
    topic_id: 1
  })
  await contenido.save()
  res.json({
    contenido
  })
}

const contentsPut = async (req, res = response) => {
  const { id } = req.params
  const { __id, ...resto } = req.body
  // let approved = false
  // if an author changes their content, the content must be approved again by an editor
  const contenido = await Contenido.findByIdAndUpdate(id, resto)

  res.json(contenido)
}

const contentDelete = async (req, res = response) => {
  const { id } = req.params

  try {
    // Buscar y eliminar el contenido por su ID
    const contenido = await Contenido.findByIdAndDelete(id)

    // Si el contenido no existe, responder con un error
    if (!contenido) {
      return res.status(404).json({
        msg: 'Content not found'
      })
    }

    // Responder con el contenido eliminado
    res.json({
      msg: 'Content deleted successfully',
      contenido
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      msg: 'Error deleting content'
    })
  }
}

module.exports = {
  contentDelete,
  contentsGet,
  getContentHiglight,
  contentsPost,
  contentsPut
}
