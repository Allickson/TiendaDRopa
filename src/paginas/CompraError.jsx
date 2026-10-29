import { Link } from 'react-router-dom'

export default function CompraError() {
  return (
    <div className="container py-4 text-center">
      <h1 className="mb-3">No pudimos completar tu compra</h1>
      <p>Algún producto de tu carrito ya no tiene stock suficiente. Revisa las cantidades e inténtalo de nuevo.</p>
      <Link to="/carrito" className="btn btn-primary">Volver al carrito</Link>
    </div>
  )
}