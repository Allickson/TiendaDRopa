'use client'
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import NavLink from './NavLink'
import type { UsuarioPublico } from '@/tipos'
import { formatoPrecio } from '@/utils/formato'

interface Props {
  categorias?: string[]
  totalItems: number
  totalPrecio?: number
  sesion?: UsuarioPublico | Pick<UsuarioPublico, 'nombre' | 'rol'> | null
  onSalir: () => void
}

export default function Navbar({ categorias = [], totalItems, totalPrecio = 0, sesion = null, onSalir }: Props) {
  const router = useRouter()
  const [busqueda, setBusqueda] = useState('')

  function buscar(e: FormEvent) {
    e.preventDefault()
    const texto = busqueda.trim()
    router.push(texto ? `/productos?q=${encodeURIComponent(texto)}` : '/productos')
  }

  return (
    <nav className="navbar navbar-expand-xl navbar-dark navbar-tienda">
      <div className="container-xxl">
        <Link className="navbar-brand" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/logo.png" alt="Pinkie, inicio" height={40} />
        </Link>
        <button className="navbar-toggler" type="button"
          data-bs-toggle="collapse" data-bs-target="#menuPrincipal"
          aria-controls="menuPrincipal" aria-expanded="false" aria-label="Abrir menú">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="menuPrincipal">
          <ul className="navbar-nav me-auto nav-compacta">
            <li className="nav-item"><NavLink href="/" exacto>Inicio</NavLink></li>
            <li className="nav-item"><NavLink href="/productos">Productos</NavLink></li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button"
                data-bs-toggle="dropdown" aria-expanded="false" onClick={e => e.preventDefault()}>
                Categorías
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" href="/categorias">Ver todas</Link></li>
                <li><hr className="dropdown-divider" /></li>
                {categorias.map(c => (
                  <li key={c}>
                    <Link className="dropdown-item" href={`/categorias/${encodeURIComponent(c)}`}>{c}</Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item"><NavLink href="/ofertas">Ofertas</NavLink></li>
            <li className="nav-item"><NavLink href="/nosotros">Nosotros</NavLink></li>
            <li className="nav-item"><NavLink href="/blog">Blog</NavLink></li>
            <li className="nav-item"><NavLink href="/contacto">Contacto</NavLink></li>
          </ul>
          <form className="d-flex buscador-navbar my-2 my-xl-0 me-xl-2" role="search" onSubmit={buscar}>
            <input className="form-control form-control-sm me-1" type="search" placeholder="Buscar"
              aria-label="Buscar productos" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
            <button className="btn btn-light btn-sm" type="submit">Buscar</button>
          </form>
          <ul className="navbar-nav align-items-xl-center gap-xl-2 text-nowrap">
            <li className="nav-item">
              <NavLink href="/carrito">
                <i className="bi bi-cart" aria-hidden="true"></i>
                <span className="visually-hidden">Carrito</span>{' '}
                <span className="badge rounded-pill text-bg-light">{totalItems}</span> {formatoPrecio(totalPrecio)}
              </NavLink>
            </li>
            {sesion ? (
              <>
                {sesion.rol === 'admin' && <li className="nav-item"><NavLink href="/admin">Admin</NavLink></li>}
                <li className="nav-item">
                  <span className="navbar-text text-white">Hola, {sesion.nombre.split(' ')[0]}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm" onClick={onSalir}>Salir</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-light btn-sm" href="/iniciar-sesion">Iniciar sesión</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-light btn-sm" href="/crear-cuenta">Crear cuenta</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
