import { startDB } from './src/repositories/startDB.js'
import express from 'express'
import amigosRouter from './src/routes/amigos.js'

const port = 3000
startDB()

const app = express()
app.use(express.json())
app.use('/amigos', amigosRouter)

app.listen(port, async () => {
  console.log(`[server] on port ${port}`)
})
