const secciones = [
  { titulo: 'Nuestra historia', texto: 'Pinkie nació en 2026 con una idea simple: ropa linda, cómoda y a buen precio, con un toque rosa en todo lo que hacemos.' },
  { titulo: 'Misión', texto: 'Vestir a nuestras clientas con prendas que las hagan sentir bien cada día, con atención cercana y despacho rápido.' },
  { titulo: 'Visión', texto: 'Ser la tienda de ropa online favorita de quienes buscan estilo sin complicarse.' }
]

export default function Nosotros() {
  return (
    <div className="container py-4" style={{ maxWidth: '760px' }}>
      <h1 className="text-center mb-4">Sobre Pinkie</h1>
      {secciones.map(s => (
        <section key={s.titulo} className="mb-4">
          <h2 className="h4">{s.titulo}</h2>
          <p>{s.texto}</p>
        </section>
      ))}
    </div>
  )
}