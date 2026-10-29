export function agregarAlCarrito(carrito, producto) {
  const existe = carrito.find(item => item.id === producto.id)
  if (existe) {
    return carrito.map(item =>
      item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
    )
  }
  return [...carrito, { ...producto, cantidad: 1 }]
}

export function cambiarCantidad(carrito, id, delta) {
  return carrito.map(item =>
    item.id === id ? { ...item, cantidad: Math.max(1, item.cantidad + delta) } : item
  )
}

export function eliminarDelCarrito(carrito, id) {
  return carrito.filter(item => item.id !== id)
}

export function calcularTotal(carrito) {
  return carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0)
}

export function contarItems(carrito) {
  return carrito.reduce((suma, item) => suma + item.cantidad, 0)
}