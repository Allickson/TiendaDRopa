interface Props {
  titulo: string
  valor: number | string
  detalle?: string
  icono: string
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

// Tarjeta de indicador del dashboard (ej: "Compras 12").
export default function TarjetaResumen({ titulo, valor, detalle, icono, color = 'primary' }: Props) {
  return (
    <div className={`card text-bg-${color} h-100`}>
      <div className="card-body d-flex align-items-center gap-3">
        <i className={`bi ${icono} fs-1`} aria-hidden="true"></i>
        <div>
          <p className="mb-0">{titulo}</p>
          <p className="h3 mb-0 text-reset">{valor}</p>
          {detalle && <small>{detalle}</small>}
        </div>
      </div>
    </div>
  )
}
