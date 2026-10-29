'use client'
import AdminUsuarioDetalle from '@/paginas/admin/AdminUsuarioDetalle'
import { useTienda } from '@/context/TiendaContext'

export default function Page() {
  const t = useTienda()
  return <AdminUsuarioDetalle usuarios={t.usuarios} ordenes={t.ordenes} />
}
