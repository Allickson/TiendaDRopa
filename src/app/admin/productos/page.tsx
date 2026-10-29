'use client'
import AdminProductos from '@/paginas/admin/AdminProductos'
import { useTienda } from '@/context/TiendaContext'

export default function Page() {
  const t = useTienda()
  return <AdminProductos productos={t.productos} onEliminar={t.eliminarProducto} />
}
