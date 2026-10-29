import type { DatosCliente, EstadoOrden, ItemCarrito, Orden } from '@/tipos'
import { calcularTotal } from './carrito'

// Número correlativo de la orden: 20260001, 20260002...
export function siguienteNumero(ordenes: Pick<Orden, 'numero'>[], anio = new Date().getFullYear()): number {
  const base = anio * 10000
  return ordenes.reduce((max, o) => Math.max(max, o.numero), base) + 1
}

export function crearOrden(
  ordenes: Orden[],
  carrito: ItemCarrito[],
  cliente: DatosCliente,
  estado: EstadoOrden,
  fecha = new Date()
): Orden {
  const numero = siguienteNumero(ordenes, fecha.getFullYear())
  return {
    numero,
    codigo: `ORDER${String(numero).slice(-5)}`,
    fecha: fecha.toISOString(),
    estado,
    cliente,
    items: carrito.map(({ id, nombre, imagen, precio, cantidad }) => ({ id, nombre, imagen, precio, cantidad })),
    total: calcularTotal(carrito)
  }
}

export function buscarOrden(ordenes: Orden[], numero: string | number): Orden | null {
  return ordenes.find(o => o.numero === Number(numero)) ?? null
}

export function ordenesDeCliente(ordenes: Orden[], correo: string): Orden[] {
  const buscado = correo.trim().toLowerCase()
  return ordenes.filter(o => o.cliente.correo.trim().toLowerCase() === buscado)
}

export interface ResumenVentas {
  pagadas: number
  rechazadas: number
  ingresos: number
  ticketPromedio: number
  masVendidos: { nombre: string; cantidad: number }[]
}

export function resumenVentas(ordenes: Orden[]): ResumenVentas {
  const pagadas = ordenes.filter(o => o.estado === 'pagada')
  const ingresos = pagadas.reduce((suma, o) => suma + o.total, 0)
  const unidades: Record<string, number> = {}
  pagadas.forEach(o => o.items.forEach(i => { unidades[i.nombre] = (unidades[i.nombre] ?? 0) + i.cantidad }))
  return {
    pagadas: pagadas.length,
    rechazadas: ordenes.length - pagadas.length,
    ingresos,
    ticketPromedio: pagadas.length ? Math.round(ingresos / pagadas.length) : 0,
    masVendidos: Object.entries(unidades)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
  }
}
