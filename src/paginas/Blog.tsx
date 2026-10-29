import Link from 'next/link'
import { entradas } from '@/data/blog'
import { formatoFecha } from '@/utils/formato'

export default function Blog() {
  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Blog</h1>
      <div className="row g-3">
        {entradas.map(e => (
          <div className="col-12 col-md-6" key={e.id}>
            <article className="card h-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={e.imagen} className="card-img-top blog-img" alt="" />
              <div className="card-body d-flex flex-column">
                <h2 className="h5 card-title">{e.titulo}</h2>
                <p className="card-text">{e.resumen}</p>
                <small className="text-muted mb-3">{formatoFecha(e.fecha + 'T00:00:00')}</small>
                <Link href={`/blog/${e.id}`} className="btn btn-outline-secondary mt-auto align-self-start">Leer más</Link>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  )
}
