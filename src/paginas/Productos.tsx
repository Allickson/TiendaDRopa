'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ListaProductos from '@/componentes/ListaProductos'
import type { Producto } from '@/tipos'
import { filtrarProductos } from '@/utils/productos'

interface Props {
  productos: Producto[]
  categorias: string[]
  onAgregar: (p: Producto) => void
}

export default function Productos({ productos, categorias, onAgregar }: Props) {
  const router = useRouter()
  const params = useSearchParams()
  // Los filtros parten desde la URL (así funciona el buscador del navbar) y viven en el estado
  const [texto, setTexto] = useState(params.get('q') ?? '')
  const [categoria, setCategoria] = useState(params.get('categoria') ?? 'Todas')
  const visibles = filtrarProductos(productos, { texto, categoria })

  // Mantiene la URL sincronizada para poder compartir o recargar la búsqueda
  function actualizarUrl(q: string, cat: string) {
    const nuevos = new URLSearchParams()
    if (q) nuevos.set('q', q)
    if (cat !== 'Todas') nuevos.set('categoria', cat)
    const query = nuevos.toString()
    router.replace(query ? `/productos?${query}` : '/productos')
  }

  return (
    <div className="container py-4">
      <h1 className="text-center mb-3">Catálogo</h1>
      <div className="row g-2 mb-4">
        <div className="col-12 col-md-8">
          <input
            className="form-control"
            type="search"
            placeholder="Buscar prenda..."
            aria-label="Buscar prenda"
            value={texto}
            onChange={e => { setTexto(e.target.value); actualizarUrl(e.target.value, categoria) }}
          />
        </div>
        <div className="col-12 col-md-4">
          <select className="form-select" aria-label="Categoría" value={categoria}
            onChange={e => { setCategoria(e.target.value); actualizarUrl(texto, e.target.value) }}>
            <option value="Todas">Todas las categorías</option>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <p className="text-muted small">{visibles.length} {visibles.length === 1 ? 'resultado' : 'resultados'}</p>
      <ListaProductos productos={visibles} onAgregar={onAgregar} mensajeVacio="No encontramos prendas con ese filtro." />
    </div>
  )
}
