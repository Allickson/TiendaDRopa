export default function ProductCard({ producto, onAgregar, onVer }) {
  const enOferta = producto.precioOferta > 0
  const precio = enOferta ? producto.precioOferta : producto.precio
  const agotado = producto.stock === 0

  return (
    <div className="card card-producto h-100 text-center">
      <img src={producto.imagen} className="card-img-top" alt={producto.nombre} />
      <div className="card-body">
        <h5 className="card-title">{producto.nombre}</h5>
        {enOferta && (
          <p className="precio-descuento text-decoration-line-through mb-0">
            ${producto.precio.toLocaleString('es-CL')}
          </p>
        )}
        <p className="precio-nuevo">${precio.toLocaleString('es-CL')}</p>
        {onVer && (
          <button className="btn btn-outline-secondary me-2" onClick={() => onVer(producto)}>
            Ver
          </button>
        )}
        <button className="btn btn-primary" disabled={agotado} onClick={() => onAgregar(producto)}>
          {agotado ? 'Agotado' : 'Agregar'}
        </button>
      </div>
    </div>
  )
}