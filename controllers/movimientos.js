/* eslint-disable camelcase */
// controllers/movements.js
const { request, response } = require('express')
const Movement = require('../models/Movement')
const jwt = require('jsonwebtoken')

// Obtener todos los movimientos
// eslint-disable-next-line no-unused-vars
const getMovements = async (req = request, res = response) => {
  const token = req.headers.authorization

  console.log('Token recibido en el back: ', { token })

  if (!token) {
    return res.status(401).json({ msg: 'No token provided' })
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET) // Verificar y decodificar el token
  const user_id = decoded.user_id // Obtener el user_id del token decodificado

  try {
    const movements = await Movement.findAll({ where: { user_id } })
    console.log(movements)
    res.json(movements)
  } catch (error) {
    console.error('Error al obtener los movimientos:', error)
    res.status(500).json({ msg: 'Error interno del servidor' })
  }
}

// Obtener un movimiento por ID
const getMovementById = async (req = request, res = response) => {
  const { id } = req.params
  try {
    const movement = await Movement.findByPk(id)
    if (movement) {
      res.json({ movement })
    } else {
      res.status(404).json({ msg: 'Movimiento no encontrado' })
    }
  } catch (error) {
    console.error('Error al obtener el movimiento:', error)
    res.status(500).json({ msg: 'Error interno del servidor' })
  }
}

// Crear un nuevo movimiento
const createMovement = async (req = request, res = response) => {
  const { concept, amount, categorie, type } = req.body

  const token = req.headers.authorization
  console.log('Token recibido en el back: ', { token })

  if (!token) {
    return res.status(401).json({ msg: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) // Verificar y decodificar el token
    const user_id = decoded.user_id // Obtener el user_id del token decodificado

    const newMovement = await Movement.create({
      concept,
      amount,
      user_id,
      categorie,
      type
    })

    console.log('Movimiento creado correctamente:', { newMovement })

    res.json({ movement: newMovement })
  } catch (error) {
    console.error('Error al verificar o crear usuario:', error)
    res.status(500).json({ msg: 'Error interno del servidor' })
  }
}

// Actualizar un movimiento por ID
const updateMovement = async (req = request, res = response) => {
  const { id } = req.params
  const { concept, amount, user_id, categorie, type } = req.body
  try {
    const movement = await Movement.findByPk(id)
    if (movement) {
      await movement.update({ concept, amount, user_id, categorie, type })
      res.json({ movement })
    } else {
      res.status(404).json({ msg: 'Movimiento no encontrado' })
    }
  } catch (error) {
    console.error('Error al actualizar el movimiento:', error)
    res.status(500).json({ msg: 'Error interno del servidor' })
  }
}

// Eliminar un movimiento por ID
const deleteMovement = async (req = request, res = response) => {
  const { id } = req.params
  try {
    const movement = await Movement.findByPk(id)
    if (movement) {
      await movement.destroy()
      res.json({ msg: 'Movimiento eliminado' })
    } else {
      res.status(404).json({ msg: 'Movimiento no encontrado' })
    }
  } catch (error) {
    console.error('Error al eliminar el movimiento:', error)
    res.status(500).json({ msg: 'Error interno del servidor' })
  }
}

module.exports = {
  getMovements,
  getMovementById,
  createMovement,
  updateMovement,
  deleteMovement
}
