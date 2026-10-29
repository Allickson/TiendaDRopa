import { Link, NavLink } from 'react-router-dom'

export default function Navbar({ totalItems }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-tienda">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src="/img/logo.png" alt="Logo" height="80" />
        </Link>
        <button className="navbar-toggler" type="button"
          data-bs-toggle="collapse" data-bs-target="#menuPrincipal"
          aria-controls="menuPrincipal" aria-expanded="false" aria-label="Abrir menú">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="menuPrincipal">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Inicio</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" to="/contacto">Contacto</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/carrito">
                <i className="bi bi-cart"></i> Carrito ({totalItems})
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}