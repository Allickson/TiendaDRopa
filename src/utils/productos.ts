import type { DatosProducto, Producto } from '@/tipos'
import { STOCK_CRITICO } from '@/data/productos'

export function precioFinal(producto: Pick<Producto, 'precio' | 'precioOferta'>): number {
  return producto.precioOferta && producto.precioOferta > 0 ? producto.precioOferta : producto.precio
}

interface Filtro {
  texto?: string
  categoria?: string
}

export function filtrarProductos(productos: Producto[], { texto = '', categoria = 'Todas' }: Filtro = {}): Producto[] {
  const buscado = texto.trim().toLowerCase()
  return productos.filter(
    p => (categoria === 'Todas' || p.categoria === categoria) && p.nombre.toLowerCase().includes(buscado)
  )
}

export function productosEnOferta(productos: Producto[]): Producto[] {
  return productos.filter(p => (p.precioOferta ?? 0) > 0)
}

export function productosCriticos(productos: Producto[], limite = STOCK_CRITICO): Producto[] {
  return productos.filter(p => p.stock <= limite).sort((a, b) => a.stock - b.stock)
}

// ---- CRUD ----

export function buscarProducto(productos: Producto[], id: string | number): Producto | null {
  return productos.find(p => p.id === Number(id)) ?? null
}

export function validarProducto(datos: Pick<DatosProducto, 'nombre' | 'precio' | 'stock' | 'precioOferta'>): string {
  if (datos.nombre.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres'
  if (!(Number(datos.precio) > 0)) return 'El precio debe ser mayor a 0'
  if (String(datos.stock).trim() === '' || !Number.isInteger(Number(datos.stock)) || Number(datos.stock) < 0) {
    return 'El stock debe ser un número entero de 0 o más'
  }
  if (datos.precioOferta && Number(datos.precioOferta) >= Number(datos.precio)) {
    return 'El precio de oferta debe ser menor al precio normal'
  }
  return ''
}

export function guardarProducto(productos: Producto[], datos: DatosProducto, id: number | null = null): Producto[] {
  const limpio: Omit<Producto, 'id'> = {
    nombre: datos.nombre.trim(),
    categoria: datos.categoria,
    imagen: datos.imagen,
    descripcion: datos.descripcion,
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

export function eliminarProducto(productos: Producto[], id: number): Producto[] {
  return productos.filter(p => p.id !== id)
}
