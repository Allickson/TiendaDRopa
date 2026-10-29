import { useNavigate } from 'react-router-dom'
import ProductCard from '../componentes/ProductCard'
import { productosEnOferta } from '../utils/productos'

export default function Ofertas({ productos, onAgregar }) {
  const navigate = useNavigate()
  const ofertas = productosEnOferta(productos)

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Ofertas de la semana</h1>
      {ofertas.length === 0 ? (
        <p className="text-center">Por ahora no tenemos ofertas. ¡Vuelve pronto!</p>
      ) : (
        <div className="row">
          {ofertas.map(p => (
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