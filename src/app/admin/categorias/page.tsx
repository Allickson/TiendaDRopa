'use client'
import AdminCategorias from '@/paginas/admin/AdminCategorias'
import { useTienda } from '@/context/TiendaContext'

export default function Page() {
  const t = useTienda()
  return <AdminCategorias categorias={t.categorias} productos={t.productos} onAgregar={t.agregarCategoria} onRenombrar={t.renombrarCategoria} onEliminar={t.eliminarCategoria} />
}
