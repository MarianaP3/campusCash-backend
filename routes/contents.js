const { Router } = require('express')
const { check } = require('express-validator')

const {
  validarCampos, validarSince, validarLimit, contentExistsById, isTopicValid, isTypeValid, isTitleValid, isLinkValid, userExistsById
} = require('../middlewares/index')

const {
  getContentsByTopic,
  contentsPost,
  contentsPut,
  contentDelete
} = require('../controllers/contenidos')

const router = Router()

router.get('/', [
  validarSince,
  validarLimit
], getContentsByTopic)

router.delete('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(contentExistsById)
], contentDelete)

router.post('/', [
  // middlewares
  check('title', 'El titulo es obligatorio').not().isEmpty(),
  check('title').custom((title) => isTitleValid(title)),
  check('content', 'El contenido es obligatorio').not().isEmpty(),
  check('topic', 'El tema es obligatorio').not().isEmpty(),
  check('topic').custom((topic) => isTopicValid(topic)),
  check('type', 'El tipo es obligatorio').not().isEmpty(),
  check('type').custom((type) => isTypeValid(type)),
  check('approved', 'El approved es obligatorio').not().isEmpty(),
  check('author', 'El autor es obligatorio').not().isEmpty(),
  check('author').custom((author) => userExistsById(author)),
  check('link').custom((link) => isLinkValid(link)),
  validarCampos
], contentsPost)

router.put('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(contentExistsById),
  check('link').custom((link) => isLinkValid(link)),
  validarCampos
], contentsPut)

module.exports = router
