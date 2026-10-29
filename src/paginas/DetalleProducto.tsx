'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import type { Producto } from '@/tipos'
import { buscarProducto, precioFinal } from '@/utils/productos'
import { formatoPrecio } from '@/utils/formato'

export default function DetalleProducto({ productos, onAgregar }: { productos: Producto[]; onAgregar: (p: Producto) => void }) {
  const { id } = useParams<{ id: string }>()
  const producto = buscarProducto(productos, id)

  if (!producto) {
    return (
      <div className="container py-4 text-center">
        <h1>Producto no encontrado</h1>
        <Link href="/productos" className="btn btn-primary">Volver al catálogo</Link>
      </div>
    )
  }

  const enOferta = (producto.precioOferta ?? 0) > 0

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/">Inicio</Link></li>
          <li className="breadcrumb-item"><Link href={`/categorias/${encodeURIComponent(producto.categoria)}`}>{producto.categoria}</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{producto.nombre}</li>
        </ol>
      </nav>
      <div className="row g-4 align-items-center">
        <div className="col-12 col-md-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded" />
        </div>
        <div className="col-12 col-md-6">
          <h1>{producto.nombre}</h1>
          <p>{producto.descripcion}</p>
          {enOferta && <p className="precio-descuento text-decoration-line-through mb-0">{formatoPrecio(producto.precio)}</p>}
          <p className="precio-nuevo">{formatoPrecio(precioFinal(producto))}</p>
          <p>{producto.stock > 0 ? `Stock disponible: ${producto.stock}` : 'Producto agotado'}</p>
          <button className="btn btn-primary me-2" disabled={producto.stock === 0} onClick={() => onAgregar(producto)}>
            Agregar al carrito
          </button>
          <Link href="/productos" className="btn btn-outline-secondary">Volver</Link>
        </div>
      </div>
    </div>
  )
}
