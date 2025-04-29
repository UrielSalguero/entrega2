import { Router } from 'express'
import ProductManager from './ProductManager.js'

const router = Router()
const productos = new ProductManager('./productos.json')

router.get('/', async (req, res) => {
  try {
    const products = await productos.obtenerproductos()
    res.render('home', { title: 'Home', products })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await productos.obtenerproductos()
    res.render('realTimeProducts', { title: 'Real-Time Products', products })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
