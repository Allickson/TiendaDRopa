'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { EstadoOrden, Orden } from '@/tipos'
import { formatoPrecio, formatoFecha } from '@/utils/formato'

export default function AdminOrdenes({ ordenes }: { ordenes: Orden[] }) {
  const [estado, setEstado] = useState<'todas' | EstadoOrden>('todas')
  const visibles = [...ordenes]
    .filter(o => estado === 'todas' || o.estado === estado)
    .sort((a, b) => b.numero - a.numero)

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">Órdenes y boletas</h1>
        <select className="form-select w-auto" aria-label="Filtrar por estado" value={estado}
          onChange={e => setEstado(e.target.value as 'todas' | EstadoOrden)}>
          <option value="todas">Todas</option>
          <option value="pagada">Pagadas</option>
          <option value="rechazada">Rechazadas</option>
        </select>
      </div>
      {visibles.length === 0 ? (
        <p role="status">Aún no hay órdenes. Aparecerán aquí cuando un cliente compre.</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>N.º</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th><th></th></tr></thead>
            <tbody>
              {visibles.map(o => (
                <tr key={o.numero}>
                  <td>{o.numero}</td>
                  <td>{formatoFecha(o.fecha)}</td>
                  <td>{o.cliente.nombre} {o.cliente.apellidos}</td>
                  <td>{formatoPrecio(o.total)}</td>
                  <td><span className={`badge ${o.estado === 'pagada' ? 'text-bg-success' : 'text-bg-danger'}`}>{o.estado}</span></td>
                  <td><Link href={`/admin/ordenes/${o.numero}`} className="btn btn-outline-secondary btn-sm">Ver boleta</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
