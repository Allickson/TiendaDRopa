'use client'
import AdminPerfil from '@/paginas/admin/AdminPerfil'
import { useTienda } from '@/context/TiendaContext'

export default function Page() {
  const t = useTienda()
  return <AdminPerfil sesion={t.sesion!} onGuardar={t.guardarPerfil} />
}
