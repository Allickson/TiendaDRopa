'use client'
import Link from 'next/link'
import type { ItemCarrito } from '@/tipos'
import { calcularTotal } from '@/utils/carrito'
import { formatoPrecio } from '@/utils/formato'

interface Props {
  carrito: ItemCarrito[]
  onCambiarCantidad?: (id: number, delta: number) => void
  onEliminar?: (id: number) => void
  onVaciar?: () => void
}

const nada = () => {}

export default function Carrito({ carrito, onCambiarCantidad = nada, onEliminar = nada, onVaciar = nada }: Props) {
  if (carrito.length === 0) {
    return (
      <div className="container py-4 text-center">
        <h1 className="mb-3">Tu carrito</h1>
        <p>El carrito está vacío.</p>
        <Link href="/productos" className="btn btn-primary">Ver catálogo</Link>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Tu carrito</h1>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr><th>Imagen</th><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr>
          </thead>
          <tbody>
            {carrito.map(item => {
              const enMaximo = typeof item.stock === 'number' && item.cantidad >= item.stock
              return (
                <tr key={item.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <td><img src={item.imagen} alt="" className="miniatura" /></td>
                  <td>{item.nombre}</td>
                  <td>{formatoPrecio(item.precio)}</td>
                  <td className="text-nowrap">
                    <button className="btn btn-outline-secondary btn-sm" aria-label={`Quitar una unidad de ${item.nombre}`}
                      disabled={item.cantidad <= 1} onClick={() => onCambiarCantidad(item.id, -1)}>-</button>
                    <span className="mx-2">{item.cantidad}</span>
                    <button className="btn btn-outline-secondary btn-sm" aria-label={`Agregar una unidad de ${item.nombre}`}
                      disabled={enMaximo} onClick={() => onCambiarCantidad(item.id, 1)}>+</button>
                    {enMaximo && <small className="d-block text-muted">Máximo disponible</small>}
                  </td>
                  <td>{formatoPrecio(item.precio * item.cantidad)}</td>
                  <td><button className="btn btn-outline-danger btn-sm" onClick={() => onEliminar(item.id)}>Eliminar</button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="d-flex flex-wrap justify-content-end align-items-center gap-3">
        <h2 className="h4 mb-0">Total: {formatoPrecio(calcularTotal(carrito))}</h2>
        <button className="btn btn-outline-secondary" onClick={onVaciar}>Vaciar carrito</button>
        <Link href="/comprar" className="btn btn-primary">Comprar ahora</Link>
      </div>
    </div>
  )
}
