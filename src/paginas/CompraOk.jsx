import { Link } from 'react-router-dom'

export default function CompraOk() {
  return (
    <div className="container py-4 text-center">
      <h1 className="mb-3">¡Gracias por tu compra!</h1>
      <p>Recibimos tu pedido y te contactaremos para coordinar la entrega.</p>
      <Link to="/" className="btn btn-primary">Seguir comprando</Link>
    </div>
  )
}