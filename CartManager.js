import mongoose from 'mongoose'

const esquemaCarrito = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
      quantity: { type: Number, default: 1 }
    }
  ]
})

const Carrito = mongoose.model('Carrito', esquemaCarrito)

export default class CartManager {
  async createCart() {
    const carrito = await Carrito.create({ products: [] })
    return carrito.toObject()
  }

  async getCartByIdPopulate(cid) {
    return await Carrito.findById(cid)
      .populate('products.product')
      .lean()
  }

  async addToCart(cid, pid) {
    const carrito = await Carrito.findById(cid)
    if (!carrito) throw new Error('Carrito no encontrado')
    const item = carrito.products.find(p => p.product.equals(pid))
    if (item) {
      item.quantity++
    } else {
      carrito.products.push({ product: pid })
    }
    await carrito.save()
    return carrito.toObject()
  }

  async removeFromCart(cid, pid) {
    const carrito = await Carrito.findById(cid)
    if (!carrito) throw new Error('Carrito no encontrado')
    carrito.products = carrito.products.filter(p => !p.product.equals(pid))
    await carrito.save()
    return carrito.toObject()
  }

  async updateCartProducts(cid, lista) {
    const carrito = await Carrito.findById(cid)
    if (!carrito) throw new Error('Carrito no encontrado')
    carrito.products = lista
    await carrito.save()
    return carrito.toObject()
  }

  async updateProductQuantity(cid, pid, cantidad) {
    const carrito = await Carrito.findById(cid)
    if (!carrito) throw new Error('Carrito no encontrado')
    const item = carrito.products.find(p => p.product.equals(pid))
    if (!item) throw new Error('Producto no en carrito')
    item.quantity = cantidad
    await carrito.save()
    return carrito.toObject()
  }

  async clearCart(cid) {
    const carrito = await Carrito.findById(cid)
    if (!carrito) throw new Error('Carrito no encontrado')
    carrito.products = []
    await carrito.save()
    return carrito.toObject()
  }
}
