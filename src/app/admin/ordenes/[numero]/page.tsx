'use client'
import AdminBoleta from '@/paginas/admin/AdminBoleta'
import { useTienda } from '@/context/TiendaContext'

export default function Page() {
  const t = useTienda()
  return <AdminBoleta ordenes={t.ordenes} />
}
