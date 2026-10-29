export function precioFinal(producto) {
  return producto.precioOferta > 0 ? producto.precioOferta : producto.precio
}

export function filtrarProductos(productos, { texto = '', categoria = 'Todas' } = {}) {
  const buscado = texto.trim().toLowerCase()
  return productos.filter(
    p =>
      (categoria === 'Todas' || p.categoria === categoria) &&
      p.nombre.toLowerCase().includes(buscado)
  )
}

export function productosEnOferta(productos) {
  return productos.filter(p => p.precioOferta > 0)
}

export function validarProducto(datos) {
  if (datos.nombre.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres'
  if (!(Number(datos.precio) > 0)) return 'El precio debe ser mayor a 0'
  if (!Number.isInteger(Number(datos.stock)) || Number(datos.stock) < 0) {
    return 'El stock debe ser un número entero de 0 o más'
  }
  if (datos.precioOferta && Number(datos.precioOferta) >= Number(datos.precio)) {
    return 'El precio de oferta debe ser menor al precio normal'
  }
  return ''
}

export function guardarProducto(productos, datos, id = null) {
  const limpio = {
    ...datos,
    precio: Number(datos.precio),
    stock: Number(datos.stock),
    precioOferta: datos.precioOferta ? Number(datos.precioOferta) : undefined
  }
  if (id === null) {
    const nuevoId = productos.reduce((max, p) => Math.max(max, p.id), 0) + 1
    return [...productos, { ...limpio, id: nuevoId }]
  }
  return productos.map(p => (p.id === id ? { ...limpio, id } : p))
}

export function eliminarProducto(productos, id) {
  return productos.filter(p => p.id !== id)
}