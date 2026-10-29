import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ProductCard from '../componentes/ProductCard'
import { categorias } from '../data/productos'
import { filtrarProductos } from '../utils/productos'

export default function Home({ productos, onAgregar }) {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [texto, setTexto] = useState('')
  const categoria = params.get('categoria') ?? 'Todas'
  const visibles = filtrarProductos(productos, { texto, categoria })

  function cambiarCategoria(e) {
    const valor = e.target.value
    setParams(valor === 'Todas' ? {} : { categoria: valor })
  }

  return (
    <div className="container py-4">
            <section className="hero-pinkie text-center py-4 mb-4">
        <img
          src="/img/logo.png"
          alt="Pinkie, tienda de ropa desde 2026"
          className="hero-logo rounded-circle"
        />
      </section>

      <h2 className="text-center mb-3">Catálogo</h2>
      <div className="row g-2 mb-4">
        <div className="col-12 col-md-8">
          <input
            className="form-control"
            type="search"
            placeholder="Buscar prenda..."
            aria-label="Buscar prenda"
            value={texto}
            onChange={e => setTexto(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-4">
          <select className="form-select" aria-label="Categoría" value={categoria} onChange={cambiarCategoria}>
            <option value="Todas">Todas las categorías</option>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {visibles.length === 0 ? (
        <p className="text-center">No encontramos prendas con ese filtro.</p>
      ) : (
        <div className="row">
          {visibles.map(p => (
            <div className="col-6 col-md-4 mb-4" key={p.id}>
              <ProductCard
                producto={p}
                onAgregar={onAgregar}
                onVer={prod => navigate(`/producto/${prod.id}`)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}