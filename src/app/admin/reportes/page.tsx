'use client'
import AdminReportes from '@/paginas/admin/AdminReportes'
import { useTienda } from '@/context/TiendaContext'

export default function Page() {
  const t = useTienda()
  return <AdminReportes ordenes={t.ordenes} productos={t.productos} categorias={t.categorias} />
}
