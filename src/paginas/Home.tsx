'use client'
import Link from 'next/link'
import CategoriaCard from '@/componentes/CategoriaCard'
import ListaProductos from '@/componentes/ListaProductos'
import type { Producto } from '@/tipos'
import { productosEnOferta } from '@/utils/productos'
import { contarPorCategoria } from '@/utils/categorias'

interface Props {
  productos: Producto[]
  categorias: string[]
  onAgregar: (p: Producto) => void
}

export default function Home({ productos, categorias, onAgregar }: Props) {
  return (
    <div className="container py-4">
      <section className="hero-pinkie text-center py-4 mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/logo.png" alt="Pinkie, tienda de ropa desde 2026" className="hero-logo rounded-circle" />
      </section>

      <section className="mb-5">
        <h2 className="text-center mb-3">Categorías</h2>
        <div className="row g-3 justify-content-center">
          {categorias.map(c => (
            <div className="col-6 col-md-3" key={c}>
              <CategoriaCard
                nombre={c}
                cantidad={contarPorCategoria(productos, c)}
                imagen={productos.find(p => p.categoria === c)?.imagen}
              />
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Ofertas de la semana</h2>
          <Link href="/productos" className="btn btn-outline-secondary btn-sm">Ver todo el catálogo</Link>
        </div>
        <ListaProductos productos={productosEnOferta(productos)} onAgregar={onAgregar} mensajeVacio="Por ahora no hay ofertas." />
      </section>
    </div>
  )
}
