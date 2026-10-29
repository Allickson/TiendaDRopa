import Link from 'next/link'
import TarjetaResumen from '@/componentes/TarjetaResumen'
import type { Orden, Producto, Usuario } from '@/tipos'
import { resumenVentas } from '@/utils/ordenes'
import { productosCriticos } from '@/utils/productos'
import { formatoPrecio } from '@/utils/formato'

const accesos = [
  { href: '/admin/ordenes', titulo: 'Órdenes', texto: 'Seguimiento de todas las compras realizadas.', icono: 'bi-receipt' },
  { href: '/admin/productos', titulo: 'Productos', texto: 'Inventario y detalles de cada prenda.', icono: 'bi-bag' },
  { href: '/admin/categorias', titulo: 'Categorías', texto: 'Organiza los productos para facilitar la navegación.', icono: 'bi-tags' },
  { href: '/admin/usuarios', titulo: 'Usuarios', texto: 'Cuentas de clientes y administradores.', icono: 'bi-people' },
  { href: '/admin/reportes', titulo: 'Reportes', texto: 'Ventas, productos más vendidos y stock.', icono: 'bi-bar-chart' },
  { href: '/admin/perfil', titulo: 'Perfil', texto: 'Tus datos personales y contraseña.', icono: 'bi-person-circle' }
]

interface Props {
  productos: Producto[]
  usuarios: Usuario[]
  ordenes: Orden[]
}

export default function AdminDashboard({ productos, usuarios, ordenes }: Props) {
  const resumen = resumenVentas(ordenes)
  const unidades = productos.reduce((suma, p) => suma + p.stock, 0)
  const criticos = productosCriticos(productos).length

  return (
    <>
      <h1 className="h3">Dashboard</h1>
      <p className="text-muted">Resumen de la actividad de la tienda</p>
      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-4">
          <TarjetaResumen titulo="Compras" valor={resumen.pagadas} detalle={`Ingresos: ${formatoPrecio(resumen.ingresos)}`} icono="bi-cart-check" color="primary" />
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <TarjetaResumen titulo="Productos" valor={productos.length} detalle={`Unidades en stock: ${unidades}`} icono="bi-box-seam" color="success" />
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <TarjetaResumen titulo="Usuarios" valor={usuarios.length} detalle={`Productos con stock crítico: ${criticos}`} icono="bi-people" color="warning" />
        </div>
      </div>
      <div className="row g-3">
        {accesos.map(a => (
          <div className="col-12 col-sm-6 col-xl-4" key={a.href}>
            <Link href={a.href} className="card h-100 text-center link-none card-producto">
              <div className="card-body">
                <i className={`bi ${a.icono} fs-2`} aria-hidden="true"></i>
                <h2 className="h6 mt-2">{a.titulo}</h2>
                <p className="small mb-0">{a.texto}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}
