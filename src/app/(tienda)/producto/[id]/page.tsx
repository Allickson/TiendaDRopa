'use client'
import DetalleProducto from '@/paginas/DetalleProducto'
import { useTienda } from '@/context/TiendaContext'

export default function Page() {
  const t = useTienda()
  return <DetalleProducto productos={t.productos} onAgregar={t.agregar} />
}
