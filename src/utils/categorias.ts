import type { Producto, Resultado } from '@/tipos'

// CRUD de categorías. Una categoría es un texto (ej: 'Superior').

export function validarCategoria(categorias: string[], nombre: string, actual: string | null = null): string {
  const limpio = nombre.trim()
  if (limpio.length < 3) return 'La categoría debe tener al menos 3 caracteres'
  const repetida = categorias.some(c => c.toLowerCase() === limpio.toLowerCase() && c !== actual)
  return repetida ? 'Ya existe una categoría con ese nombre' : ''
}

export function agregarCategoria(categorias: string[], nombre: string): string[] {
  return [...categorias, nombre.trim()]
}

// Renombra la categoría y actualiza los productos que la usan
export function renombrarCategoria(categorias: string[], productos: Producto[], actual: string, nuevo: string) {
  const limpio = nuevo.trim()
  return {
    categorias: categorias.map(c => (c === actual ? limpio : c)),
    productos: productos.map(p => (p.categoria === actual ? { ...p, categoria: limpio } : p))
  }
}

export function contarPorCategoria(productos: Pick<Producto, 'categoria'>[], categoria: string): number {
  return productos.filter(p => p.categoria === categoria).length
}

// Solo se elimina si ningún producto la usa
export function eliminarCategoria(
  categorias: string[],
  productos: Pick<Producto, 'categoria'>[],
  nombre: string
): Resultado<{ categorias: string[] }> {
  if (contarPorCategoria(productos, nombre) > 0) {
    return { ok: false, error: 'No se puede eliminar: hay productos en esta categoría' }
  }
  return { ok: true, categorias: categorias.filter(c => c !== nombre) }
}
