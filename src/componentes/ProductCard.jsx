export default function ProductCard({ producto, onAgregar }) {
  return (
    <div className="card card-producto h-100 text-center">
      <img src={producto.imagen} className="card-img-top" alt={producto.nombre} />
      <div className="card-body">
        <h5 className="card-title">{producto.nombre}</h5>
        <p className="precio-nuevo">${producto.precio.toLocaleString('es-CL')}</p>
        <button className="btn btn-primary" onClick={() => onAgregar(producto)}>
          Agregar
        </button>
      </div>
    </div>
  )
}