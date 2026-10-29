'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import ResumenOrden from '@/componentes/ResumenOrden'
import type { Orden } from '@/tipos'
import { buscarOrden } from '@/utils/ordenes'

export default function AdminBoleta({ ordenes }: { ordenes: Orden[] }) {
  const { numero } = useParams<{ numero: string }>()
  const orden = buscarOrden(ordenes, numero)

  if (!orden) {
    return (
      <>
        <h1 className="h3">Orden no encontrada</h1>
        <Link href="/admin/ordenes" className="btn btn-primary">Volver a órdenes</Link>
      </>
    )
  }

  return (
    <div style={{ maxWidth: '900px' }}>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2 no-imprimir">
        <Link href="/admin/ordenes">‹ Volver a órdenes</Link>
        <button className="btn btn-danger btn-sm" onClick={() => window.print()}>Imprimir boleta</button>
      </div>
      <h1 className="h3">
        Boleta n.º {orden.numero}{' '}
        <span className={`badge fs-6 ${orden.estado === 'pagada' ? 'text-bg-success' : 'text-bg-danger'}`}>{orden.estado}</span>
      </h1>
      <ResumenOrden orden={orden} />
    </div>
  )
}
