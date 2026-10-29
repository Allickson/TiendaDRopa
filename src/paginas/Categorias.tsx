'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import CategoriaCard from '@/componentes/CategoriaCard'
import ListaProductos from '@/componentes/ListaProductos'
import type { Producto } from '@/tipos'
import { contarPorCategoria } from '@/utils/categorias'

interface Props {
  productos: Producto[]
  categorias: string[]
  onAgregar: (p: Producto) => void
}

// /categorias muestra todas; /categorias/[nombre] además lista sus productos
export default function Categorias({ productos, categorias, onAgregar }: Props) {
  const { nombre } = useParams<{ nombre: string }>()
  const seleccionada = nombre ? decodeURIComponent(nombre) : null
  const existe = !seleccionada || categorias.includes(seleccionada)

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Categorías</h1>
      <div className="row g-3 justify-content-center mb-4">
        {categorias.map(c => (
          <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={c}>
            <CategoriaCard nombre={c} cantidad={contarPorCategoria(productos, c)}
              imagen={productos.find(p => p.categoria === c)?.imagen} />
          </div>
        ))}
      </div>

      {!existe && (
        <div className="alert alert-warning text-center" role="alert">
          La categoría “{seleccionada}” no existe. <Link href="/categorias">Ver todas</Link>
        </div>
      )}

      {seleccionada && existe && (
        <section>
          <h2 className="mb-3">{seleccionada}</h2>
          <ListaProductos productos={productos.filter(p => p.categoria === seleccionada)}
            onAgregar={onAgregar} mensajeVacio="Esta categoría todavía no tiene productos." />
        </section>
      )}
    </div>
  )
}
