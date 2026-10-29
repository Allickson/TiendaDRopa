'use client'
import AdminUsuarios from '@/paginas/admin/AdminUsuarios'
import { useTienda } from '@/context/TiendaContext'

export default function Page() {
  const t = useTienda()
  return <AdminUsuarios usuarios={t.usuarios} sesion={t.sesion!} onEliminar={t.eliminarUsuario} />
}
