'use client'
import CrearCuenta from '@/paginas/CrearCuenta'
import { useTienda } from '@/context/TiendaContext'

export default function Page() {
  const t = useTienda()
  return <CrearCuenta onRegistrar={t.registrar} />
}
