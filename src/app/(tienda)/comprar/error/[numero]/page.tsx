'use client'
import CompraError from '@/paginas/CompraError'
import { useTienda } from '@/context/TiendaContext'

export default function Page() {
  const t = useTienda()
  return <CompraError ordenes={t.ordenes} />
}
