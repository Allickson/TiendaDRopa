'use client'
import Categorias from '@/paginas/Categorias'
import { useTienda } from '@/context/TiendaContext'

export default function Page() {
  const t = useTienda()
  return <Categorias productos={t.productos} categorias={t.categorias} onAgregar={t.agregar} />
}
