'use client'
import Carrito from '@/paginas/Carrito'
import { useTienda } from '@/context/TiendaContext'

export default function Page() {
  const t = useTienda()
  return <Carrito carrito={t.carrito} onCambiarCantidad={t.cambiarCantidad} onEliminar={t.eliminarDelCarrito} onVaciar={t.vaciarCarrito} />
}
