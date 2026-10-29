import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { calcularTotal, hayStock } from '../utils/carrito'
import {
  validarNombre, validarEmail, validarTelefono, validarDireccion, validarComuna
} from '../utils/validaciones'

const campos = [
  { name: 'nombre',    label: 'Nombre',               type: 'text',  validar: validarNombre },
  { name: 'email',     label: 'Email',                type: 'email', validar: validarEmail },
  { name: 'telefono',  label: 'Teléfono',             type: 'tel',   validar: validarTelefono },
  { name: 'direccion', label: 'Dirección de entrega', type: 'text',  validar: validarDireccion },
  { name: 'comuna',    label: 'Comuna',               type: 'text',  validar: validarComuna }
]

export default function Comprar({ carrito, productos, sesion, onConfirmar }) {
  const navigate = useNavigate()
  const [valores, setValores] = useState({
    nombre: sesion?.nombre ?? '',
    email: sesion?.correo ?? '',
    telefono: '',
    direccion: '',
    comuna: ''
  })
  const [errores, setErrores] = useState({})

  if (carrito.length === 0) {
    return (
      <div className="container py-4 text-center">
        <h1 className="mb-3">Finalizar compra</h1>
        <p>Tu carrito está vacío.</p>
        <Link to="/" className="btn btn-primary">Ver catálogo</Link>
      </div>
    )
  }

  function manejarCambio(e) {
    setValores({ ...valores, [e.target.name]: e.target.value })
  }

  function manejarEnvio(e) {
    e.preventDefault()
    const nuevos = {}
    campos.forEach(c => { nuevos[c.name] = c.validar(valores[c.name]) })
    setErrores(nuevos)
    if (Object.values(nuevos).some(m => m !== '')) return

    if (!hayStock(carrito, productos)) {
      navigate('/comprar/error')
      return
    }
    onConfirmar()
    navigate('/comprar/ok')
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Finalizar compra</h1>
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <form onSubmit={manejarEnvio} noValidate>
            {campos.map(c => (
              <div className="mb-3" key={c.name}>
                <label htmlFor={c.name} className="form-label">{c.label}</label>
                <input
                  id={c.name}
                  name={c.name}
                  type={c.type}
                  className={`form-control ${errores[c.name] ? 'is-invalid' : ''}`}
                  value={valores[c.name]}
                  onChange={manejarCambio}
                />
                <div className="invalid-feedback">{errores[c.name]}</div>
              </div>
            ))}
            <button type="submit" className="btn btn-primary w-100">Confirmar compra</button>
          </form>
        </div>
        <div className="col-12 col-lg-5">
          <div className="card">
            <div className="card-body">
              <h2 className="h5">Resumen</h2>
              <ul className="list-unstyled mb-3">
                {carrito.map(item => (
                  <li key={item.id} className="d-flex justify-content-between">
                    <span>{item.nombre} x{item.cantidad}</span>
                    <span>${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
                  </li>
                ))}
              </ul>
              <h3 className="h5 text-end">Total: ${calcularTotal(carrito).toLocaleString('es-CL')}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}