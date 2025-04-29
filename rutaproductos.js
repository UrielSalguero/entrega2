import { Router } from 'express'
import ProductManager from './ProductManager.js'

const router = Router()
const productos = new ProductManager('./productos.json')

router.get('/', async (req, res) => {
  try {
    const lista = await productos.obtenerproductos()
    res.json({ productos: lista })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/:pid', async (req, res) => {
  try {
    const producto = await productos.obtenerProductoID(parseInt(req.params.pid))
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }
    res.json({ producto })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const nuevoProducto = await productos.agregarProducto(req.body)
    const io = req.app.get('io')
    io.emit('nuevoProducto', nuevoProducto)
    res.status(201).json({ mensaje: 'Producto agregado', producto: nuevoProducto })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/:pid', async (req, res) => {
  try {
    const actualizado = await productos.actualizarProducto(parseInt(req.params.pid), req.body)
    res.json({ mensaje: 'Producto actualizado', producto: actualizado })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid)
    await productos.eliminarProducto(pid)
    const io = req.app.get('io')
    io.emit('productoEliminado', pid)
    res.json({ mensaje: 'Producto eliminado' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
