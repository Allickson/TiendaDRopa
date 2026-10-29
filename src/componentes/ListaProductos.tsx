'use client'
import { useRouter } from 'next/navigation'
import ProductCard from './ProductCard'
import type { Producto } from '@/tipos'

interface Props {
  productos: Producto[]
  onAgregar: (producto: Producto) => void
  mensajeVacio?: string
}

// Grilla responsiva de productos: 2 por fila en móvil, 3 en tablet, 4 en escritorio.
export default function ListaProductos({ productos, onAgregar, mensajeVacio = 'No hay productos para mostrar.' }: Props) {
  const router = useRouter()

  if (productos.length === 0) {
    return <p className="text-center my-4" role="status">{mensajeVacio}</p>
  }

  return (
    <div className="row g-3">
      {productos.map(p => (
        <div className="col-6 col-md-4 col-lg-3" key={p.id}>
          <ProductCard producto={p} onAgregar={onAgregar} onVer={prod => router.push(`/producto/${prod.id}`)} />
        </div>
      ))}
    </div>
  )
}
