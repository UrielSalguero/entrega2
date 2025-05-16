import mongoose from 'mongoose'

const productoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  codigo: { type: String, required: true, unique: true },
  precio: { type: Number, required: true },
  estado: { type: Boolean, default: true },
  stock: { type: Number, required: true },
  categoria: { type: String, required: true },
  imagen: { type: [String], default: [] }
})

const Producto = mongoose.model('Producto', productoSchema, 'productos')
export default class ProductManager {
  async getAll({ limit = 10, page = 1, query, sort }) {
    const filtro = {}
    if (query) {
      const [clave, valor] = query.split(':')
      filtro[clave] = isNaN(valor) ? valor : Number(valor)
    }
    const ordenar = sort === 'asc' ? { precio: 1 } : sort === 'desc' ? { precio: -1 } : {}
    const totalDocs = await Producto.countDocuments(filtro)
    const totalPages = Math.ceil(totalDocs / limit) || 1
    const hasPrevPage = page > 1
    const hasNextPage = page < totalPages
    const prevPage = hasPrevPage ? page - 1 : null
    const nextPage = hasNextPage ? page + 1 : null

    const productos = await Producto.find(filtro)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort(ordenar)
      .lean()

    const base = '/products'
    const qp = [`limit=${limit}`]
    if (sort) qp.push(`sort=${sort}`)
    if (query) qp.push(`query=${query}`)
    const qs = qp.join('&')

    return {
      status: 'success',
      payload: productos,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? `${base}?page=${prevPage}&${qs}` : null,
      nextLink: hasNextPage ? `${base}?page=${nextPage}&${qs}` : null
    }
  }
  
  async getById(id) {
    return await Producto.findById(id).lean()
  }

  async addProduct(data) {
    const nuevo = await Producto.create(data)
    return nuevo.toObject()
  }

  async updateProduct(id, data) {
    return await Producto.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    }).lean()
  }

  async deleteProduct(id) {
    await Producto.findByIdAndDelete(id)
    return true
  }
}
