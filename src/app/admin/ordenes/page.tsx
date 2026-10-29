'use client'
import AdminOrdenes from '@/paginas/admin/AdminOrdenes'
import { useTienda } from '@/context/TiendaContext'

export default function Page() {
  const t = useTienda()
  return <AdminOrdenes ordenes={t.ordenes} />
}
