import { Link } from 'react-router-dom'

export default function NoEncontrado() {
  return (
    <div className="container py-4 text-center">
      <h1>Página no encontrada</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/" className="btn btn-primary">Ir al inicio</Link>
    </div>
  )
}