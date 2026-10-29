'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import ResumenOrden from '@/componentes/ResumenOrden'
import type { Orden } from '@/tipos'
import { buscarOrden } from '@/utils/ordenes'

export default function CompraOk({ ordenes }: { ordenes: Orden[] }) {
  const { numero } = useParams<{ numero: string }>()
  const orden = buscarOrden(ordenes, numero)

  if (!orden || orden.estado !== 'pagada') {
    return (
      <div className="container py-4 text-center">
        <h1>No encontramos esa compra</h1>
        <Link href="/" className="btn btn-primary">Ir al inicio</Link>
      </div>
    )
  }

  return (
    <div className="container py-4" style={{ maxWidth: '900px' }}>
      <div className="card shadow-sm">
        <div className="card-body p-3 p-md-4">
          <h1 className="h3 text-success">
            <i className="bi bi-check-circle me-2" aria-hidden="true"></i>
            Se ha realizado la compra n.º {orden.numero}
          </h1>
          <ResumenOrden orden={orden} />
          <div className="d-flex flex-wrap justify-content-center gap-2 no-imprimir">
            <button className="btn btn-danger" onClick={() => window.print()}>Imprimir boleta en PDF</button>
            <Link href="/productos" className="btn btn-success">Seguir comprando</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
