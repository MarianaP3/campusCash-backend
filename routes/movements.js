// routes/movements.js
const { Router } = require('express')
const { check } = require('express-validator')
const { CATEGORIES, TYPES } = require('../constants')

const {
  getMovements,
  getMovementById,
  createMovement,
  updateMovement,
  deleteMovement
} = require('../controllers/movimientos')

const router = Router()

router.get('/', getMovements)

router.get('/:id', getMovementById)

router.post('/createMovement', [
  check('concept', 'El concepto es obligatorio').not().isEmpty(),
  check('amount', 'El monto es obligatorio y debe ser un número positivo').isFloat({ gt: 0 }),
  // check('user_id', 'El ID de usuario es obligatorio').isInt(),
  check('categorie', 'La categoría es obligatoria y debe ser válida').isIn(Object.values(CATEGORIES)),
  check('type', 'El tipo es obligatorio y debe ser válido').isIn(Object.values(TYPES))
], createMovement)

router.put('/:id', [
  check('concept', 'El concepto es obligatorio').not().isEmpty(),
  check('amount', 'El monto es obligatorio y debe ser un número positivo').isFloat({ gt: 0 }),
  check('user_id', 'El ID de usuario es obligatorio').isInt(),
  check('categorie', 'La categoría es obligatoria y debe ser válida').isIn(Object.values(CATEGORIES)),
  check('type', 'El tipo es obligatorio y debe ser válido').isIn(Object.values(TYPES))
], updateMovement)
router.delete('/:id', deleteMovement)

module.exports = router
