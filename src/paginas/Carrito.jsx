import { Link } from 'react-router-dom'
import { calcularTotal } from '../utils/carrito'

export default function Carrito({ carrito, onCambiarCantidad, onEliminar }) {
  if (carrito.length === 0) {
    return (
      <div className="container py-4 text-center">
        <h1 className="mb-3">Tu carrito</h1>
        <p>El carrito está vacío.</p>
        <Link to="/" className="btn btn-primary">Ver catálogo</Link>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Tu carrito</h1>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th>
            </tr>
          </thead>
          <tbody>
            {carrito.map(item => (
              <tr key={item.id}>
                <td>{item.nombre}</td>
                <td>${item.precio.toLocaleString('es-CL')}</td>
                <td>
                  <button className="btn btn-outline-secondary btn-sm"
                    onClick={() => onCambiarCantidad(item.id, -1)}>-</button>
                  <span className="mx-2">{item.cantidad}</span>
                  <button className="btn btn-outline-secondary btn-sm"
                    onClick={() => onCambiarCantidad(item.id, 1)}>+</button>
                </td>
                <td>${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
                <td>
                  <button className="btn btn-outline-danger btn-sm"
                    onClick={() => onEliminar(item.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h4 className="text-end">Total: ${calcularTotal(carrito).toLocaleString('es-CL')}</h4>
    </div>
  )
}