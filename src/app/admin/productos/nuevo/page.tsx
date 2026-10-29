'use client'
import AdminProductoForm from '@/paginas/admin/AdminProductoForm'
import { useTienda } from '@/context/TiendaContext'

export default function Page() {
  const t = useTienda()
  return <AdminProductoForm productos={t.productos} categorias={t.categorias} onGuardar={t.guardarProducto} />
}
