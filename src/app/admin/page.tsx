'use client'
import AdminDashboard from '@/paginas/admin/AdminDashboard'
import { useTienda } from '@/context/TiendaContext'

export default function Page() {
  const t = useTienda()
  return <AdminDashboard productos={t.productos} usuarios={t.usuarios} ordenes={t.ordenes} />
}
