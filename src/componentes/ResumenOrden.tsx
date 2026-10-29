import TablaItems from './TablaItems'
import type { Orden } from '@/tipos'
import { formatoPrecio, formatoFecha } from '@/utils/formato'

function Dato({ label, valor, col = 'col-12 col-md-4' }: { label: string; valor?: string; col?: string }) {
  return (
    <div className={col}>
      <span className="form-label d-block small">{label}</span>
      <div className="form-control bg-light">{valor || '—'}</div>
    </div>
  )
}

// Detalle completo de una orden: cliente, dirección, productos y total.
export default function ResumenOrden({ orden }: { orden: Orden }) {
  const { cliente } = orden
  return (
    <>
      <p className="small text-muted mb-3">
        Código de orden: <strong>{orden.codigo}</strong> · Fecha: {formatoFecha(orden.fecha)}
      </p>
      <h2 className="h5">Datos del cliente</h2>
      <div className="row g-2 mb-3">
        <Dato label="Nombre" valor={cliente.nombre} />
        <Dato label="Apellidos" valor={cliente.apellidos} />
        <Dato label="Correo" valor={cliente.correo} />
      </div>
      <h2 className="h5">Dirección de entrega</h2>
      <div className="row g-2 mb-3">
        <Dato label="Calle" valor={cliente.calle} col="col-12 col-md-8" />
        <Dato label="Departamento" valor={cliente.departamento} />
        <Dato label="Región" valor={cliente.region} col="col-12 col-md-6" />
        <Dato label="Comuna" valor={cliente.comuna} col="col-12 col-md-6" />
        <Dato label="Indicaciones" valor={cliente.indicaciones} col="col-12" />
      </div>
      <TablaItems items={orden.items} />
      <p className="total-orden text-center fs-4 my-3">
        Total {orden.estado === 'pagada' ? 'pagado' : 'a pagar'}: {formatoPrecio(orden.total)}
      </p>
    </>
  )
}
