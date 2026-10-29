import type { ItemCarrito, Producto } from '@/tipos'

// Funciones puras del carrito: reciben el carrito y devuelven uno nuevo.

type NuevoItem = Omit<ItemCarrito, 'cantidad'>

// Cantidad máxima según el stock (sin límite si no viene stock)
function maximo(item: { stock?: number }): number {
  return typeof item.stock === 'number' ? item.stock : Infinity
}

export function agregarAlCarrito(carrito: ItemCarrito[], producto: NuevoItem): ItemCarrito[] {
  const existe = carrito.find(item => item.id === producto.id)
  if (existe) {
    return carrito.map(item =>
      item.id === producto.id
        ? { ...item, stock: producto.stock, cantidad: Math.min(item.cantidad + 1, maximo(producto)) }
        : item
    )
  }
  if (maximo(producto) < 1) return carrito
  return [...carrito, { ...producto, cantidad: 1 }]
}

export function cambiarCantidad(carrito: ItemCarrito[], id: number, delta: number): ItemCarrito[] {
  return carrito.map(item =>
    item.id === id
      ? { ...item, cantidad: Math.min(Math.max(1, item.cantidad + delta), maximo(item)) }
      : item
  )
}

export function eliminarDelCarrito(carrito: ItemCarrito[], id: number): ItemCarrito[] {
  return carrito.filter(item => item.id !== id)
}

export function calcularTotal(carrito: Pick<ItemCarrito, 'precio' | 'cantidad'>[]): number {
  return carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0)
}

export function contarItems(carrito: Pick<ItemCarrito, 'cantidad'>[]): number {
  return carrito.reduce((suma, item) => suma + item.cantidad, 0)
}

export function hayStock(carrito: Pick<ItemCarrito, 'id' | 'cantidad'>[], productos: Producto[]): boolean {
  return carrito.every(item => {
    const producto = productos.find(p => p.id === item.id)
    return Boolean(producto) && producto!.stock >= item.cantidad
  })
}

export function descontarStock(productos: Producto[], carrito: Pick<ItemCarrito, 'id' | 'cantidad'>[]): Producto[] {
  return productos.map(p => {
    const item = carrito.find(i => i.id === p.id)
    return item ? { ...p, stock: p.stock - item.cantidad } : p
  })
}

// Ajusta el carrito al catálogo actual: precio vigente, stock disponible
// y quita productos eliminados o agotados.
export function sincronizarCarrito(
  carrito: ItemCarrito[],
  productos: Producto[],
  precioDe: (p: Producto) => number = p => p.precio
): ItemCarrito[] {
  return carrito.flatMap(item => {
    const p = productos.find(prod => prod.id === item.id)
    if (!p || p.stock < 1) return []
    return [{ ...item, precio: precioDe(p), stock: p.stock, cantidad: Math.min(item.cantidad, p.stock) }]
  })
}
