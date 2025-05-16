import express from 'express'
import { createServer } from 'http'
import { Server as IOServer } from 'socket.io'
import { engine } from 'express-handlebars'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import rutaproductos from './rutaproductos.js'
import rutacarts from './rutacarts.js'
import viewsRouter from './views.js'
import methodOverride from 'method-override'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const httpServer = createServer(app)
const io = new IOServer(httpServer)

mongoose
  .connect('mongodb://localhost:27017/ecommerce')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conexión MongoDB:', err))

app.engine('handlebars', engine({
  layoutsDir: path.join(__dirname, 'views'),
  defaultLayout: 'main',
  helpers: {
    mult: (a, b) => a * b
  }
}))

app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))
app.use(
  '/css',
  express.static(path.join(__dirname, 'views', 'css'))
)

app.use(express.static(path.join(__dirname, 'public')))
app.use('/js', express.static(path.join(__dirname, 'public', 'js')))
app.use(methodOverride('_method'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('io', io)
app.use('/api/productos', rutaproductos)
app.use('/api/carrito', rutacarts)
app.use('/', viewsRouter)

const PUERTO = 8080
httpServer.listen(PUERTO, () =>
  console.log(`Servidor levantado en http://localhost:${PUERTO}`)
)
