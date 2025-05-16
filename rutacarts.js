import { Router } from 'express'
import CartManager from './CartManager.js'

const router = Router()
const cm = new CartManager()

router.post('/', async (req, res) => {
  try {
    const carrito = await cm.createCart()
    res.status(201).json({ status: 'success', payload: carrito })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.get('/:cid', async (req, res) => {
  try {
    const carrito = await cm.getCartByIdPopulate(req.params.cid)
    if (!carrito) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })
    res.json({ status: 'success', payload: carrito })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    await cm.addToCart(req.params.cid, req.params.pid)
    res.redirect('/products')
  } catch (error) {
    res.status(500).send('Error al agregar al carrito')
  }
})

router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    await cm.removeFromCart(req.params.cid, req.params.pid)
    res.redirect(`/carts/${req.params.cid}`)
  } catch (error) {
    res.status(500).send('Error al eliminar producto del carrito')
  }
})

router.put('/:cid', async (req, res) => {
  try {
    await cm.updateCartProducts(req.params.cid, req.body)
    res.redirect(`/carts/${req.params.cid}`)
  } catch (error) {
    res.status(500).send('Error al actualizar productos del carrito')
  }
})

router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { quantity } = req.body
    await cm.updateProductQuantity(req.params.cid, req.params.pid, quantity)
    res.redirect(`/carts/${req.params.cid}`)
  } catch (error) {
    res.status(500).send('Error al actualizar cantidad del producto')
  }
})

router.delete('/:cid', async (req, res) => {
  try {
    await cm.clearCart(req.params.cid)
    res.redirect('/products')
  } catch (error) {
    res.status(500).send('Error al vaciar el carrito')
  }
})

export default router
