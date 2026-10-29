'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import ResumenOrden from '@/componentes/ResumenOrden'
import type { Orden } from '@/tipos'
import { buscarOrden } from '@/utils/ordenes'

export default function CompraError({ ordenes }: { ordenes: Orden[] }) {
  const { numero } = useParams<{ numero: string }>()
  const orden = buscarOrden(ordenes, numero)

  return (
    <div className="container py-4" style={{ maxWidth: '900px' }}>
      <div className="card shadow-sm">
        <div className="card-body p-3 p-md-4">
          <h1 className="h3 text-danger">
            <i className="bi bi-x-circle me-2" aria-hidden="true"></i>
            No se pudo realizar el pago{orden ? ` n.º ${orden.numero}` : ''}
          </h1>
          <p>
            Uno o más productos ya no tienen stock suficiente. Ajustamos tu carrito a las
            unidades disponibles; revísalo y vuelve a intentar el pago.
          </p>
          <div className="text-center mb-4">
            <Link href="/carrito" className="btn btn-success">Volver a realizar el pago</Link>
          </div>
          {orden && <ResumenOrden orden={orden} />}
        </div>
      </div>
    </div>
  )
}
