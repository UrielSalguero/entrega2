const socket = io()

const form = document.getElementById('productForm')
const list = document.getElementById('productList')

socket.on('nuevoProducto', producto => {
    const li = document.createElement('li')
    li.dataset.id = producto.id
    li.innerHTML =
        ` ${producto.titulo} - $${producto.precio}
    <button class="deleteBtn">Eliminar</button>`
    list.appendChild(li)
})

socket.on('productoEliminado', id => {
    const item = list.querySelector(`li[data-id="${id}"]`)
    if (item) item.remove()
})

form.addEventListener('submit', e => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(form))
    socket.emit('nuevoProducto', data)
    form.reset()
})

list.addEventListener('click', e => {
    if (e.target.matches('.deleteBtn')) {
        const id = e.target.closest('li').dataset.id
        socket.emit('productoEliminado', Number(id))
    }
})

