'use client'
import AdminUsuarioForm from '@/paginas/admin/AdminUsuarioForm'
import { useTienda } from '@/context/TiendaContext'

export default function Page() {
  const t = useTienda()
  return <AdminUsuarioForm usuarios={t.usuarios} onGuardar={t.guardarUsuario} />
}
