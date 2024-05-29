const { validationResult } = require('express-validator')

const DEFAULT_MSG_MANY_ERRORS = 'Se han encontrado múltiples errores.'
const DEFAULT_MSG_ONE_ERRORS = 'Se ha encontrado un error.'

const validarCampos = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    next()
    return
  }

  const errorsArray = errors.array()

  const firstErrorMessage = errorsArray.at(0)?.msg ?? DEFAULT_MSG_ONE_ERRORS
  const isThereMoreThanOneError = errorsArray.length > 1

  return res.status(400).json({
    msg: isThereMoreThanOneError ? DEFAULT_MSG_MANY_ERRORS : firstErrorMessage,
    errors: errorsArray
  })
}

const isValueNotANumber = (value) => {
  return isNaN(value) || value < 0
}

const validarSince = (req, res, next) => {
  const { since } = req.query

  if (!since) {
    next()
    return
  }

  if (isValueNotANumber(since)) {
    return res.status(400).json({ error: 'El valor de since debe ser un número entero positivo' })
  }

  next()
}

const validarLimit = (req, res, next) => {
  const { limit } = req.query

  if (!limit || !isValueNotANumber(limit)) return next()

  return res.status(400).json({
    error: 'El valor de limit debe ser un número entero positivo.'
  })
}

module.exports = {
  validarCampos,
  validarLimit,
  validarSince
}
