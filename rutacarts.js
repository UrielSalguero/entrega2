import { Router } from 'express'
import CartManager from './CartManager.js'

const router = Router()
const carts = new CartManager('./carts.json')

router.post('/', async (req, res) => {
  try {
    const nuevoCarrito = await carts.crearcarrito()
    res.status(201).json({ mensaje: 'Carrito creado', carrito: nuevoCarrito })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/:cid', async (req, res) => {
  try {
    const carrito = await carts.obtenerCarritoPorId(req.params.cid)
    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' })
    }
    res.json({ productos: carrito.productos })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const carritoActualizado = await carts.agregarAlCarrito(req.params.cid, req.params.pid)
    res.json({ mensaje: 'Producto agregado al carrito', carrito: carritoActualizado })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
