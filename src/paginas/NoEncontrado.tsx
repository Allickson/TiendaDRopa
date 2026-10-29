import Link from 'next/link'

export default function NoEncontrado() {
  return (
    <div className="container py-4 text-center">
      <h1>Página no encontrada</h1>
      <p>La página que buscas no existe.</p>
      <Link href="/" className="btn btn-primary">Ir al inicio</Link>
    </div>
  )
}
