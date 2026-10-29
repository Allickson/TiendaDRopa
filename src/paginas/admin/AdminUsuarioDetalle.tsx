'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import type { Orden, Usuario } from '@/tipos'
import { buscarUsuario, nombreCompleto } from '@/utils/usuarios'
import { ordenesDeCliente } from '@/utils/ordenes'
import { formatoPrecio, formatoFecha } from '@/utils/formato'

// Mostrar usuario + historial de compras
export default function AdminUsuarioDetalle({ usuarios, ordenes }: { usuarios: Usuario[]; ordenes: Orden[] }) {
  const { run } = useParams<{ run: string }>()
  const usuario = buscarUsuario(usuarios, run)

  if (!usuario) {
    return (
      <>
        <h1 className="h3">Usuario no encontrado</h1>
        <Link href="/admin/usuarios" className="btn btn-primary">Volver</Link>
      </>
    )
  }

  const historial = ordenesDeCliente(ordenes, usuario.correo)
  const gastado = historial.filter(o => o.estado === 'pagada').reduce((s, o) => s + o.total, 0)

  return (
    <>
      <Link href="/admin/usuarios">‹ Volver a usuarios</Link>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-2 mb-3">
        <h1 className="h3 mb-0">{nombreCompleto(usuario)}</h1>
        <Link href={`/admin/usuarios/${usuario.run}/editar`} className="btn btn-outline-secondary">Editar usuario</Link>
      </div>
      <dl className="row">
        <dt className="col-4 col-md-2">RUN</dt><dd className="col-8 col-md-10">{usuario.run}</dd>
        <dt className="col-4 col-md-2">Correo</dt><dd className="col-8 col-md-10">{usuario.correo}</dd>
        <dt className="col-4 col-md-2">Rol</dt><dd className="col-8 col-md-10">{usuario.rol}</dd>
        <dt className="col-4 col-md-2">Total comprado</dt><dd className="col-8 col-md-10">{formatoPrecio(gastado)}</dd>
      </dl>
      <h2 className="h5">Historial de compras</h2>
      {historial.length === 0 ? (
        <p role="status">Este usuario todavía no tiene compras.</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>N.º</th><th>Fecha</th><th>Productos</th><th>Total</th><th>Estado</th><th></th></tr></thead>
            <tbody>
              {historial.map(o => (
                <tr key={o.numero}>
                  <td>{o.numero}</td>
                  <td>{formatoFecha(o.fecha)}</td>
                  <td>{o.items.reduce((s, i) => s + i.cantidad, 0)}</td>
                  <td>{formatoPrecio(o.total)}</td>
                  <td>{o.estado}</td>
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
