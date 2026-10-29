const entradas = [
  { id: 1, titulo: 'Cómo combinar rosa sin morir en el intento', fecha: '2026-03-12', resumen: 'Tres combinaciones fáciles para usar rosa todos los días.' },
  { id: 2, titulo: 'Cuidado de tus prendas', fecha: '2026-04-02', resumen: 'Consejos de lavado para que tu ropa dure más.' },
  { id: 3, titulo: 'Tendencias de la temporada', fecha: '2026-05-20', resumen: 'Lo que se viene en colores y texturas.' }
]

export default function Blog() {
  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Blog</h1>
      <div className="row g-3">
        {entradas.map(e => (
          <div className="col-12 col-md-4" key={e.id}>
            <article className="card h-100">
              <div className="card-body">
                <h2 className="h5 card-title">{e.titulo}</h2>
                <p className="card-text">{e.resumen}</p>
                <small className="text-muted">{new Date(e.fecha + 'T00:00:00').toLocaleDateString('es-CL')}</small>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  )
}