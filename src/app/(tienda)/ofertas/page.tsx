'use client'
import Ofertas from '@/paginas/Ofertas'
import { useTienda } from '@/context/TiendaContext'

export default function Page() {
  const t = useTienda()
  return <Ofertas productos={t.productos} onAgregar={t.agregar} />
}
