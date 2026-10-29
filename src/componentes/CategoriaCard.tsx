import Link from 'next/link'

interface Props {
  nombre: string
  imagen?: string
  cantidad: number
}

export default function CategoriaCard({ nombre, imagen, cantidad }: Props) {
  return (
    <Link href={`/categorias/${encodeURIComponent(nombre)}`} className="card card-producto h-100 text-center link-none">
      {imagen
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={imagen} className="card-img-top categoria-img" alt="" />
        : <div className="categoria-img categoria-img-vacia" aria-hidden="true" />}
      <div className="card-body py-2">
        <h3 className="h6 card-title mb-0">{nombre}</h3>
        <small className="text-muted">{cantidad} {cantidad === 1 ? 'producto' : 'productos'}</small>
      </div>
    </Link>
  )
}
