import { Link, NavLink } from 'react-router-dom'
import { categorias } from '../data/productos'

export default function Navbar({ totalItems, totalPrecio = 0, sesion, onSalir }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-tienda">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src="/img/logo.png" alt="Pinkie" height="40" />
        </Link>
        <button className="navbar-toggler" type="button"
          data-bs-toggle="collapse" data-bs-target="#menuPrincipal"
          aria-controls="menuPrincipal" aria-expanded="false" aria-label="Abrir menú">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="menuPrincipal">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>Inicio</NavLink>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button"
                data-bs-toggle="dropdown" aria-expanded="false"
                onClick={e => e.preventDefault()}>
                Categorías
              </a>
              <ul className="dropdown-menu">
                {categorias.map(c => (
                  <li key={c}>
                    <Link className="dropdown-item" to={`/?categoria=${c}`}>{c}</Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item"><NavLink className="nav-link" to="/ofertas">Ofertas</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/nosotros">Nosotros</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/blog">Blog</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/contacto">Contacto</NavLink></li>
          </ul>
          <ul className="navbar-nav align-items-lg-center gap-lg-2">
            <li className="nav-item">
              <NavLink className="nav-link" to="/carrito">
                <i className="bi bi-cart"></i> Carrito ({totalItems}) ${totalPrecio.toLocaleString('es-CL')}
              </NavLink>
            </li>
            {sesion ? (
              <>
                {sesion.rol === 'admin' && (
                  <li className="nav-item"><NavLink className="nav-link" to="/admin">Admin</NavLink></li>
                )}
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
                  <Link className="btn btn-outline-light btn-sm" to="/iniciar-sesion">Iniciar sesión</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-light btn-sm" to="/crear-cuenta">Crear cuenta</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}