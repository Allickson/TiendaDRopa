import ProductCard from '../componentes/ProductCard'
import { productos } from '../data/productos'

export default function Home({ onAgregar }) {
  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Catálogo</h1>
      <div className="row">
        {productos.map(p => (
          <div className="col-6 col-md-4 mb-4" key={p.id}>
            <ProductCard producto={p} onAgregar={onAgregar} />
          </div>
        ))}
      </div>
    </div>
  )
}