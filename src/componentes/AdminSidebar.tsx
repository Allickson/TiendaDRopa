'use client'
import Link from 'next/link'
import NavLink from './NavLink'

const enlaces = [
  { href: '/admin', texto: 'Dashboard', icono: 'bi-speedometer2', exacto: true },
  { href: '/admin/ordenes', texto: 'Órdenes', icono: 'bi-receipt' },
  { href: '/admin/productos', texto: 'Productos', icono: 'bi-bag' },
  { href: '/admin/categorias', texto: 'Categorías', icono: 'bi-tags' },
  { href: '/admin/usuarios', texto: 'Usuarios', icono: 'bi-people' },
  { href: '/admin/reportes', texto: 'Reportes', icono: 'bi-bar-chart' },
  { href: '/admin/perfil', texto: 'Perfil', icono: 'bi-person-circle' }
]

export default function AdminSidebar({ nombre, onSalir }: { nombre: string; onSalir: () => void }) {
  return (
    <nav className="admin-sidebar p-3" aria-label="Menú de administración">
      <p className="fw-bold mb-3">Pinkie · {nombre}</p>
      <ul className="nav nav-pills flex-md-column flex-nowrap overflow-auto gap-1">
        {enlaces.map(e => (
          <li className="nav-item" key={e.href}>
            <NavLink href={e.href} exacto={e.exacto} className="nav-link text-nowrap">
              <i className={`bi ${e.icono} me-2`} aria-hidden="true"></i>{e.texto}
            </NavLink>
          </li>
        ))}
      </ul>
      <hr />
      <div className="d-flex flex-md-column gap-2">
        <Link href="/" className="btn btn-dark btn-sm"><i className="bi bi-shop me-1"></i>Ir a la tienda</Link>
        <button type="button" className="btn btn-danger btn-sm" onClick={onSalir}>
          <i className="bi bi-box-arrow-left me-1"></i>Cerrar sesión
        </button>
      </div>
    </nav>
  )
}
