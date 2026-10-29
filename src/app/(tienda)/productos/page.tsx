'use client'
import { Suspense } from 'react'
import Productos from '@/paginas/Productos'
import { useTienda } from '@/context/TiendaContext'

export default function Page() {
  const t = useTienda()
  return (
    // useSearchParams necesita un límite de Suspense para el prerender de Next
    <Suspense fallback={null}>
      <Productos productos={t.productos} categorias={t.categorias} onAgregar={t.agregar} />
    </Suspense>
  )
}
