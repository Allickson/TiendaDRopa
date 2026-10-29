import type { Producto } from '@/tipos'
import { formatoPrecio } from '@/utils/formato'
import { precioFinal } from '@/utils/productos'

interface Props {
  producto: Pick<Producto, 'id' | 'nombre' | 'precio' | 'imagen'> & Partial<Producto>
  onAgregar: (producto: Producto) => void
  onVer?: (producto: Producto) => void
}

export default function ProductCard({ producto, onAgregar, onVer }: Props) {
  const enOferta = (producto.precioOferta ?? 0) > 0
  const agotado = producto.stock === 0
  const p = producto as Producto

  return (
    <div className="card card-producto h-100 text-center">
      {enOferta && <span className="badge text-bg-danger position-absolute top-0 start-0 m-2">Oferta</span>}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={producto.imagen} className="card-img-top" alt={producto.nombre} />
      <div className="card-body d-flex flex-column">
        <h3 className="h5 card-title">{producto.nombre}</h3>
        {enOferta && (
          <p className="precio-descuento text-decoration-line-through mb-0">{formatoPrecio(producto.precio)}</p>
        )}
        <p className="precio-nuevo">{formatoPrecio(precioFinal(producto))}</p>
        <div className="mt-auto d-flex flex-wrap justify-content-center gap-2">
          {onVer && <button className="btn btn-outline-secondary" onClick={() => onVer(p)}>Ver</button>}
          <button className="btn btn-primary" disabled={agotado} onClick={() => onAgregar(p)}>
            {agotado ? 'Agotado' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  )
}
