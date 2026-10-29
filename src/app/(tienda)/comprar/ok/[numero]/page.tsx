'use client'
import CompraOk from '@/paginas/CompraOk'
import { useTienda } from '@/context/TiendaContext'

export default function Page() {
  const t = useTienda()
  return <CompraOk ordenes={t.ordenes} />
}
