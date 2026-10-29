import Link from 'next/link'
import type { Producto } from '@/tipos'
import { productosCriticos } from '@/utils/productos'
import { STOCK_CRITICO } from '@/data/productos'

export default function AdminCriticos({ productos }: { productos: Producto[] }) {
  const criticos = productosCriticos(productos)

  return (
    <>
      <Link href="/admin/productos">‹ Volver a productos</Link>
      <h1 className="h3 mt-2">Productos con stock crítico</h1>
      <p className="text-muted">Productos con {STOCK_CRITICO} unidades o menos.</p>
      {criticos.length === 0 ? (
        <div className="alert alert-success" role="status">Todos los productos tienen stock suficiente.</div>
      ) : (
        <ul className="list-group">
          {criticos.map(p => (
            <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{p.nombre} <small className="text-muted">({p.categoria})</small></span>
              <span className="d-flex align-items-center gap-2">
                <span className={`badge ${p.stock === 0 ? 'text-bg-danger' : 'text-bg-warning'}`}>
                  {p.stock === 0 ? 'Agotado' : `${p.stock} u.`}
                </span>
                <Link href={`/admin/productos/${p.id}/editar`} className="btn btn-outline-secondary btn-sm">Reponer</Link>
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
