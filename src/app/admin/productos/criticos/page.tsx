'use client'
import AdminCriticos from '@/paginas/admin/AdminCriticos'
import { useTienda } from '@/context/TiendaContext'

export default function Page() {
  const t = useTienda()
  return <AdminCriticos productos={t.productos} />
}
