'use client'
import ListaProductos from '@/componentes/ListaProductos'
import type { Producto } from '@/tipos'
import { productosEnOferta } from '@/utils/productos'

export default function Ofertas({ productos, onAgregar }: { productos: Producto[]; onAgregar: (p: Producto) => void }) {
  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Ofertas de la semana</h1>
      <ListaProductos productos={productosEnOferta(productos)} onAgregar={onAgregar}
        mensajeVacio="Por ahora no tenemos ofertas. ¡Vuelve pronto!" />
    </div>
  )
}
