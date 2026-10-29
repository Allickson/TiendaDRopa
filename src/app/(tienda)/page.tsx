'use client'
import Home from '@/paginas/Home'
import { useTienda } from '@/context/TiendaContext'

export default function Page() {
  const t = useTienda()
  return <Home productos={t.productos} categorias={t.categorias} onAgregar={t.agregar} />
}
