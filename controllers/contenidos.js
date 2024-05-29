/* eslint-disable camelcase */
const { response, request } = require('express')

const Contenido = require('../models/content')

// GET METHODS
const contentsGet = async (req = request, res = response) => {
  const { limit = 5, since = 0 } = req.query
  const query = { approved: true }

  const [total, contenidos] = await Promise.all([
    // It runs simultaneously
    Contenido.countDocuments(query)
      .skip(since)
      .limit(limit)
  ])

  res.json({
    total,
    contenidos
  })
}
const getContentsByTopic = async (req = request, res = response) => {
  // Dynamic query for the topic content
  const { limit = 10, since = 0 } = req.query
  const query = { topic: req.topic }
  // It runs simultaneously
  const [total, contenidos] = await Promise.all([
    Contenido.find(query)
      .skip(since)
      .limit(limit)
  ])
  res.json({
    total,
    contenidos
  })
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
    image,
    topic,
    editor
  } = req.body

  const contenido = new Contenido({
    title,
    content,
    image,
    topic,
    editor
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
  getContentsByTopic,
  getContentHiglight,
  contentsPost,
  contentsPut
}
