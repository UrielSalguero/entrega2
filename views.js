import { Router } from 'express'
import ProductManager from './ProductManager.js'
import CartManager    from './CartManager.js'

const router = Router()
const gestorProd = new ProductManager()
const gestorCar  = new CartManager()

let cartIdGlobal = null

router.use(async (req, res, next) => {
  if (!cartIdGlobal) {
    const nuevoCarrito = await gestorCar.createCart()
    cartIdGlobal = nuevoCarrito._id.toString()
    console.log('Carrito inicializado con ID:', cartIdGlobal)
  }
  next()
})

router.get('/', (req, res) => {
  res.redirect('/products')
})

router.get('/products', async (req, res) => {
  try {
    const { limit, page, query, sort } = req.query
    const data = await gestorProd.getAll({
      limit: Number(limit),
      page:  Number(page),
      query,
      sort
    })
    res.render('home', {
      title: 'Nuestros Productos',
      products:   data.payload,
      pagination: data,
      cartId:     cartIdGlobal
    })
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get('/products/:pid', async (req, res) => {
  try {
    const prod = await gestorProd.getById(req.params.pid)
    if (!prod) return res.status(404).send('Producto no encontrado')
    res.render('productDetail', {
      title:   prod.titulo,
      product: prod,
      cartId:  cartIdGlobal
    })
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await gestorCar.getCartByIdPopulate(req.params.cid)
    if (!cart) return res.status(404).send('Carrito no encontrado')
    res.render('cart', {
      title:    `Carrito ${req.params.cid}`,
      products: cart.products,
      cartId:   req.params.cid
    })
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get('/realtimeproducts', async (req, res) => {
  try {
    const data = await gestorProd.getAll({ limit: 100, page: 1 })
    res.render('realTimeProducts', {
      title:    'Productos en tiempo real',
      products: data.payload
    })
  } catch (error) {
    res.status(500).send(error.message)
  }
})

export default router
