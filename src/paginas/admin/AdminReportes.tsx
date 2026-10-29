import type { Orden, Producto } from '@/tipos'
import { resumenVentas } from '@/utils/ordenes'
import { productosCriticos } from '@/utils/productos'
import { contarPorCategoria } from '@/utils/categorias'
import { formatoPrecio } from '@/utils/formato'

interface Props {
  ordenes: Orden[]
  productos: Producto[]
  categorias: string[]
}

export default function AdminReportes({ ordenes, productos, categorias }: Props) {
  const r = resumenVentas(ordenes)
  const maximo = r.masVendidos[0]?.cantidad ?? 1
  const valorInventario = productos.reduce((s, p) => s + p.precio * p.stock, 0)

  const indicadores: [string, string | number][] = [
    ['Ingresos', formatoPrecio(r.ingresos)],
    ['Compras pagadas', r.pagadas],
    ['Pagos rechazados', r.rechazadas],
    ['Ticket promedio', formatoPrecio(r.ticketPromedio)]
  ]

  return (
    <>
      <h1 className="h3 mb-3">Reportes</h1>
      <div className="row g-3 mb-4">
        {indicadores.map(([titulo, valor]) => (
          <div className="col-6 col-lg-3" key={titulo}>
            <div className="card card-body text-center h-100">
              <p className="mb-1 small">{titulo}</p>
              <p className="h4 mb-0">{valor}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <section className="col-12 col-lg-6">
          <h2 className="h5">Productos más vendidos</h2>
          {r.masVendidos.length === 0 ? (
            <p role="status">Sin ventas registradas todavía.</p>
          ) : (
            r.masVendidos.slice(0, 5).map(p => (
              <div key={p.nombre} className="mb-2">
                <div className="d-flex justify-content-between small"><span>{p.nombre}</span><span>{p.cantidad} u.</span></div>
                <div className="progress" role="progressbar" aria-label={`${p.nombre}: ${p.cantidad} unidades`}
                  aria-valuenow={p.cantidad} aria-valuemin={0} aria-valuemax={maximo}>
                  <div className="progress-bar" style={{ width: `${(p.cantidad / maximo) * 100}%` }}></div>
                </div>
              </div>
            ))
          )}
        </section>
        <section className="col-12 col-lg-6">
          <h2 className="h5">Inventario</h2>
          <ul className="list-group mb-3">
            {categorias.map(c => (
              <li key={c} className="list-group-item d-flex justify-content-between">
                <span>{c}</span><span>{contarPorCategoria(productos, c)} productos</span>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between fw-bold">
              <span>Valor del inventario</span><span>{formatoPrecio(valorInventario)}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <span>Productos con stock crítico</span><span>{productosCriticos(productos).length}</span>
            </li>
          </ul>
        </section>
      </div>
    </>
  )
}
