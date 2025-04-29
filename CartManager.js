import fs from 'fs'

class CartManager {
  constructor(ruta) {
    this.ruta = ruta
  }

  async cargarcarrito() {
    try {
      const datos = await fs.promises.readFile(this.ruta, 'utf-8')
      return JSON.parse(datos)
    } catch (error) {
      return []
    }
  }

  async guardarcarrito(carritos) {
    await fs.promises.writeFile(this.ruta, JSON.stringify(carritos, null, 2))
  }

  async crearcarrito() {
    const carritos = await this.cargarcarrito()

    const nuevoCarrito = {
      id: carritos.length > 0 ? carritos[carritos.length - 1].id + 1 : 1,
      productos: []
    }

    carritos.push(nuevoCarrito)
    await this.guardarcarrito(carritos)
    return nuevoCarrito
  }

  async obtenerCarritoPorId(idcarrito) {
    const carritos = await this.cargarcarrito()
    return carritos.find(c => c.id === parseInt(idcarrito)) || null
  }

  async agregarAlCarrito(idcarrito, idproducto) {
    const carritos = await this.cargarcarrito()
    const cart = carritos.find(c => c.id === parseInt(idcarrito))

    if (!cart) {
      throw new Error('Carrito no encontrado')
    }

    const productoEnCarrito = cart.productos.find(p => p.id === parseInt(idproducto))

    if (productoEnCarrito) {
      productoEnCarrito.cantidad += 1
    } else {
      cart.productos.push({ id: parseInt(idproducto), cantidad: 1 })
    }

    await this.guardarcarrito(carritos)
    return cart
  }
}

export default CartManager
