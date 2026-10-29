'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Producto } from '@/tipos'
import { filtrarProductos } from '@/utils/productos'
import { formatoPrecio } from '@/utils/formato'
import { STOCK_CRITICO } from '@/data/productos'

export default function AdminProductos({ productos, onEliminar }: { productos: Producto[]; onEliminar: (id: number) => void }) {
  const [texto, setTexto] = useState('')
  const visibles = filtrarProductos(productos, { texto })

  function eliminar(producto: Producto) {
    if (window.confirm(`¿Eliminar "${producto.nombre}"?`)) onEliminar(producto.id)
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">Productos</h1>
        <div className="d-flex flex-wrap gap-2">
          <Link href="/admin/productos/criticos" className="btn btn-outline-secondary">Stock crítico</Link>
          <Link href="/admin/productos/nuevo" className="btn btn-primary">Nuevo producto</Link>
        </div>
      </div>
      <input className="form-control mb-3" type="search" placeholder="Buscar producto..."
        aria-label="Buscar producto" value={texto} onChange={e => setTexto(e.target.value)} />
      <div className="table-responsive">
        <table className="table align-middle">
          <thead><tr><th>Imagen</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Oferta</th><th>Stock</th><th></th></tr></thead>
          <tbody>
            {visibles.map(p => (
              <tr key={p.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <td><img src={p.imagen} alt="" className="miniatura" /></td>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>{formatoPrecio(p.precio)}</td>
                <td>{p.precioOferta ? formatoPrecio(p.precioOferta) : '-'}</td>
                <td className={p.stock <= STOCK_CRITICO ? 'text-danger fw-bold' : ''}>{p.stock}</td>
                <td className="text-nowrap">
                  <Link href={`/admin/productos/${p.id}/editar`} className="btn btn-outline-secondary btn-sm me-1">Editar</Link>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => eliminar(p)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
