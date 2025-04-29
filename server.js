import express from 'express'
import { createServer } from 'http'
import { Server as IOServer } from 'socket.io'
import { engine } from 'express-handlebars'

import rutaproductos from './rutaproductos.js'
import rutacarts from './rutacarts.js'
import viewsRouter from './views.js'

const server = express()
const httpServer = createServer(server)
const io = new IOServer(httpServer)


server.engine('handlebars', engine({
  layoutsDir: './views',
  defaultLayout: 'main'
}))
server.set('view engine', 'handlebars')
server.set('views', './views')


server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(express.static('public'))
server.use('/js', express.static('./'))


server.set('io', io)

server.use('/api/productos', rutaproductos)
server.use('/api/carritos', rutacarts)


server.use('/', viewsRouter)

httpServer.listen(8080, () => {
  console.log('servidor levantado en http://localhost:8080')
})
