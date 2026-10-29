import type { ItemOrden } from '@/tipos'
import { formatoPrecio } from '@/utils/formato'

// Tabla de solo lectura con los productos de un carrito u orden.
export default function TablaItems({ items }: { items: ItemOrden[] }) {
  return (
    <div className="table-responsive">
      <table className="table align-middle mb-0">
        <thead>
          <tr><th>Imagen</th><th>Nombre</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th></tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <td><img src={i.imagen} alt="" className="miniatura" /></td>
              <td>{i.nombre}</td>
              <td>{formatoPrecio(i.precio)}</td>
              <td>{i.cantidad}</td>
              <td>{formatoPrecio(i.precio * i.cantidad)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
