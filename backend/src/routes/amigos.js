import { Router } from 'express'
import { useLocalStorage } from '../services/local-storage/use-local-storage.js'
import { KEYS } from '../constants/keys.js'
import { MESSAGES } from '../constants/messages.js'
import { validateEmail } from '../utils/validate-email.js'
import { isNullUndefinedOrEmpty } from '../utils/is-null-undefined-or-empty.js'
import { isNotUniqueByField } from '../utils/is-not-unique-by-field.js'
import { FIELDS } from '../constants/fields.js'

const router = Router()
const localStorage = useLocalStorage()

router.post('/', async (req, res, next) => {
  try {
    const amigo = req.body

    if (
      isNullUndefinedOrEmpty(amigo.nome) ||
      isNullUndefinedOrEmpty(amigo.email)
    ) {
      res.status(400).send(MESSAGES.POR_FAVOR_PREENCHA_TODOS_OS_CAMPOS)
    }

    if (validateEmail(amigo.email)) {
      res.status(400).send(MESSAGES.EMAIL_INVALIDO)
    }

    const { amigos, nextId } = localStorage.getObject(KEYS.AMIGOS)

    if (isNotUniqueByField(amigos, amigo.nome, FIELDS.NOME)) {
      res.status(400).send(MESSAGES.JA_EXISTE_UM_AMIGO_COM_ESSE_NOME)
    }

    if (isNotUniqueByField(amigos, amigo.email, FIELDS.EMAIL)) {
      res.status(400).send(MESSAGES.JA_EXISTE_UM_AMIGO_COM_ESSE_EMAIL)
    }

    const amigoWithId = { ...amigo, id: nextId + 1 }
    const newAmigosArray = [...amigos, amigoWithId]
    const newAmigosObject = {
      nextId,
      amigos: newAmigosArray,
    }

    localStorage.setObject(KEYS.AMIGOS, newAmigosObject)

    res.status(201).send(amigo)
  } catch (err) {
    next(err)
  }
})

router.put('/', async (req, res, next) => {
  try {
    const amigo = {}
    res.send(amigo)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    res.end()
  } catch (err) {
    next(err)
  }
})

router.get('/all', async (req, res, next) => {
  try {
    const amigos = localStorage.getObject(KEYS.AMIGOS)
    res.send(amigos)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const amigo = {}
    res.send(amigo)
  } catch (err) {
    next(err)
  }
})

router.use((err, req, res, _) => {
  console.log(`${req.method} ${req.baseUrl} - ${err.message}`)
  res.status(400).send({ error: err.message })
})

export default router
