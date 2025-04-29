import fs from 'fs'

class ProductManager {
  constructor(ruta) {
    this.ruta = ruta
  }

  async cargarProductos() {
    try {
      const datos = await fs.promises.readFile(this.ruta, 'utf-8')
      return JSON.parse(datos)
    } catch (error) {
      return []
    }
  }

  async guardarProductos(productos) {
    await fs.promises.writeFile(this.ruta, JSON.stringify(productos, null, 2))
  }

  async agregarProducto(producto) {
    const productos = await this.cargarProductos()
    const { titulo, descripcion, codigo, precio, estado, stock, categoria, imagen } = producto

    if (!titulo || !descripcion || !codigo || !precio || stock == null || !categoria) {
      throw new Error('Faltan datos del producto')
    }

    const nuevoproducto = {
      id: productos.length > 0 ? productos[productos.length - 1].id + 1 : 1,
      titulo,
      descripcion,
      codigo,
      precio,
      estado: estado ?? true,
      stock,
      categoria,
      imagen: imagen || []
    }

    productos.push(nuevoproducto)
    await this.guardarProductos(productos)
    return nuevoproducto
  }

  async obtenerproductos() {
    return await this.cargarProductos()
  }

  async obtenerProductoID(idproducto) {
    const productos = await this.cargarProductos()
    const producto = productos.find(p => p.id === parseInt(idproducto))
    return producto || null
  }

  async actualizarProducto(idproducto, producto) {
    const productos = await this.cargarProductos()
    const indice = productos.findIndex(p => p.id === parseInt(idproducto))
    if (indice === -1) {
      throw new Error('Producto no encontrado')
    }

    productos[indice] = {
      ...productos[indice],
      ...producto
    }

    await this.guardarProductos(productos)
    return productos[indice]
  }

  async eliminarProducto(idproducto) {
    const productos = await this.cargarProductos()
    const indice = productos.findIndex(p => p.id === parseInt(idproducto))
    if (indice === -1) {
      throw new Error('Producto no encontrado')
    }

    productos.splice(indice, 1)
    await this.guardarProductos(productos)
    return true
  }
}

export default ProductManager
