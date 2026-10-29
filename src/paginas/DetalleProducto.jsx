import { Link, useParams } from 'react-router-dom'
import { precioFinal } from '../utils/productos'

export default function DetalleProducto({ productos, onAgregar }) {
  const { id } = useParams()
  const producto = productos.find(p => p.id === Number(id))

  if (!producto) {
    return (
      <div className="container py-4 text-center">
        <h1>Producto no encontrado</h1>
        <Link to="/" className="btn btn-primary">Volver al catálogo</Link>
      </div>
    )
  }

  const enOferta = producto.precioOferta > 0

  return (
    <div className="container py-4">
      <div className="row g-4 align-items-center">
        <div className="col-12 col-md-6">
          <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded" />
        </div>
        <div className="col-12 col-md-6">
          <h1>{producto.nombre}</h1>
          <p>{producto.descripcion}</p>
          {enOferta && (
            <p className="precio-descuento text-decoration-line-through mb-0">
              ${producto.precio.toLocaleString('es-CL')}
            </p>
          )}
          <p className="precio-nuevo">${precioFinal(producto).toLocaleString('es-CL')}</p>
          <p>{producto.stock > 0 ? `Stock disponible: ${producto.stock}` : 'Producto agotado'}</p>
          <button
            className="btn btn-primary me-2"
            disabled={producto.stock === 0}
            onClick={() => onAgregar(producto)}
          >
            Agregar al carrito
          </button>
          <Link to="/" className="btn btn-outline-secondary">Volver</Link>
        </div>
      </div>
    </div>
  )
}