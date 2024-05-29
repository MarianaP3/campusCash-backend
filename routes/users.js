const { Router } = require('express')
const { check } = require('express-validator')
// const { ROLES } = require('../constants')

const {
  validarCampos, validarSince, validarLimit, isEmailValid, userExistsById
} = require('../middlewares/index')

const {
  usuariosGet,
  usuariosPost,
  usuariosDelete,
  usuariosPut,
  deactivateUsers,
  activateUsers
} = require('../controllers/usuarios')

const router = Router()

router.get('/api/', [
  validarSince,
  validarLimit
], usuariosGet)

router.get('/api/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(userExistsById),
  validarCampos
], usuariosGet)

router.post('/', [
  // middlewares
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('email', 'El correo es obligatorio').not().isEmpty(),
  check('email').custom((email) => isEmailValid(email)),
  check('password', 'La contraseña es obligatoria').not().isEmpty(),
  // validarCampos
], usuariosPost)

router.put('/api/:id', [
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('last_name', 'El apellido es obligatorio').not().isEmpty(),
  check('email', 'El correo es obligatorio').not().isEmpty(),
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(userExistsById),
  check('about_user', 'La información sobre ti es obligatoria').not().isEmpty(),
  validarCampos
], usuariosPut)

// endpoints that uses 'updateMany'
router.put('/', activateUsers, deactivateUsers)

router.patch('/ruta', (req, res) => {
  const mensaje = 'usersPatch'
  res.send(mensaje)
})

router.delete('/api/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(userExistsById),
  validarCampos
], usuariosDelete)

module.exports = router
