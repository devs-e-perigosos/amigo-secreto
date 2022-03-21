import { Router } from 'express'
import { useLocalStorage } from '../services/local-storage/use-local-storage.js'
import { KEYS } from '../constants/keys.js'
import { MESSAGES } from '../constants/messages.js'
import {
  validateEmail,
  isNotUniqueByField,
  isNullUndefinedOrEmpty,
  isSameAmigo,
} from '../utils/index.js'
import { FIELDS } from '../constants/fields.js'
import { drawAmigo } from '../utils/draw-amigo.js'

const MINIMO_AMIGOS_SORTEIO = 3

const router = Router()
const localStorage = useLocalStorage()

router.post('/', async (req, res, next) => {
  try {
    const amigo = req.body

    if (
      isNullUndefinedOrEmpty(amigo.nome) ||
      isNullUndefinedOrEmpty(amigo.email)
    ) {
      throw new Error(MESSAGES.POR_FAVOR_PREENCHA_TODOS_OS_CAMPOS)
    }

    if (validateEmail(amigo.email)) {
      throw new Error(MESSAGES.EMAIL_INVALIDO)
    }

    const { amigos, nextId } = localStorage.getObject(KEYS.AMIGOS)

    if (isNotUniqueByField(amigos, amigo.nome, FIELDS.NOME)) {
      throw new Error(MESSAGES.JA_EXISTE_UM_AMIGO_COM_ESSE_NOME)
    }

    if (isNotUniqueByField(amigos, amigo.email, FIELDS.EMAIL)) {
      throw new Error(MESSAGES.JA_EXISTE_UM_AMIGO_COM_ESSE_EMAIL)
    }

    const amigoWithId = { ...amigo, id: nextId }
    const newAmigosArray = [...amigos, amigoWithId]
    const newAmigosObject = {
      nextId: nextId + 1,
      amigos: newAmigosArray,
    }

    localStorage.setObject(KEYS.AMIGOS, newAmigosObject)

    res.status(201).send(MESSAGES.AMIGO_ADICIONADO_COM_SUCESSO)
  } catch (err) {
    next(err)
  }
})

router.put('/sorteio', async (req, res, next) => {
  try {
    const { amigos } = localStorage.getObject(KEYS.AMIGOS)

    if (amigos.length < MINIMO_AMIGOS_SORTEIO) {
      throw new Error(
        MESSAGES.PRECISA_DE_PELO_MENOS_3_AMIGOS_PARA_REALIZAR_O_SORTEIO
      )
    }

    const sorteio = amigos.reduce(drawAmigo, [])

    console.log(sorteio)

    //TODO adicionar logica de envio de email

    res.send(MESSAGES.SORTEIO_REALIZADO_COM_SUCESSO)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const newAmigo = req.body

    if (
      isNullUndefinedOrEmpty(newAmigo.nome) ||
      isNullUndefinedOrEmpty(newAmigo.email)
    ) {
      throw new Error(MESSAGES.POR_FAVOR_PREENCHA_TODOS_OS_CAMPOS)
    }

    if (validateEmail(newAmigo.email)) {
      throw new Error(MESSAGES.EMAIL_INVALIDO)
    }

    const { amigos, nextId } = localStorage.getObject(KEYS.AMIGOS)

    const oldAmigo = amigos.find(amigo => amigo.id == id)

    if (isNullUndefinedOrEmpty(oldAmigo)) {
      throw new Error(MESSAGES.NAO_EXISTE_UM_AMIGO_COM_ESSE_ID)
    }

    const hasNotSameName = !(oldAmigo.nome === newAmigo.nome)
    const hasNotSameEmail = !(oldAmigo.email === newAmigo.email)

    if (
      hasNotSameName &&
      isNotUniqueByField(amigos, newAmigo.nome, FIELDS.NOME)
    ) {
      throw new Error(MESSAGES.JA_EXISTE_UM_AMIGO_COM_ESSE_NOME)
    }

    if (
      hasNotSameEmail &&
      isNotUniqueByField(amigos, newAmigo.email, FIELDS.EMAIL)
    ) {
      throw new Error(MESSAGES.JA_EXISTE_UM_AMIGO_COM_ESSE_EMAIL)
    }

    if (isSameAmigo(hasNotSameName, hasNotSameEmail)) {
      throw new Error(MESSAGES.ESSE_AMIGO_JA_POSSUI_ESSES_DADOS)
    }

    const newAmigos = amigos.map(amigo => {
      if (amigo.id == id) {
        return {
          ...newAmigo,
          id,
        }
      }
      return amigo
    })

    const newAmigosObject = {
      nextId,
      amigos: newAmigos,
    }

    localStorage.setObject(KEYS.AMIGOS, newAmigosObject)

    res.send(MESSAGES.AMIGO_EDITADO_COM_SUCESSO)
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
    const { amigos } = localStorage.getObject(KEYS.AMIGOS)

    if (amigos.length === 0) {
      res.status(204).send()
    } else {
      res.send(amigos)
    }
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const amigos = localStorage.getObject(KEYS.AMIGOS).amigos
    const amigoById = amigos.filter(objetos => objetos.id == req.params.id)

    if (amigoById.length === 0) {
      res.status(204).send()
    } else {
      res.send(amigoById[0])
    }
  } catch (err) {
    next(err)
  }
})

router.use((err, req, res, _) => {
  console.log(`${req.method} ${req.baseUrl} - ${err.message}`)
  res.status(400).send({ error: err.message })
})

export default router
