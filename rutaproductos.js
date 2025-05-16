import { Router } from 'express'
import ProductManager from './ProductManager.js'

const router = Router()
const pm = new ProductManager()

router.get('/', async (req, res) => {
  try {
    const { limit, page, query, sort } = req.query
    const resultado = await pm.getAll({
      limit: Number(limit),
      page: Number(page),
      query,
      sort
    })
    res.json(resultado)
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.get('/:pid', async (req, res) => {
  try {
    const producto = await pm.getById(req.params.pid)
    if (!producto) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
    res.json({ status: 'success', payload: producto })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const creado = await pm.addProduct(req.body)
    req.app.get('io').emit('nuevoProducto', creado)
    res.status(201).json({ status: 'success', payload: creado })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.put('/:pid', async (req, res) => {
  try {
    const actualizado = await pm.updateProduct(req.params.pid, req.body)
    res.json({ status: 'success', payload: actualizado })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.delete('/:pid', async (req, res) => {
  try {
    await pm.deleteProduct(req.params.pid)
    req.app.get('io').emit('productoEliminado', req.params.pid)
    res.json({ status: 'success', message: 'Producto eliminado' })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

export default router
