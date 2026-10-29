'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { entradas } from '@/data/blog'
import { formatoFecha } from '@/utils/formato'

export default function BlogDetalle() {
  const { id } = useParams<{ id: string }>()
  const entrada = entradas.find(e => e.id === Number(id))

  if (!entrada) {
    return (
      <div className="container py-4 text-center">
        <h1>Artículo no encontrado</h1>
        <Link href="/blog" className="btn btn-primary">Volver al blog</Link>
      </div>
    )
  }

  return (
    <article className="container py-4" style={{ maxWidth: '760px' }}>
      <Link href="/blog" className="small">‹ Volver al blog</Link>
      <h1 className="mt-2">{entrada.titulo}</h1>
      <p className="text-muted">{formatoFecha(entrada.fecha + 'T00:00:00')}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={entrada.imagen} alt="" className="img-fluid rounded mb-3 blog-img-detalle" />
      {entrada.contenido.map((parrafo, i) => <p key={i}>{parrafo}</p>)}
    </article>
  )
}
