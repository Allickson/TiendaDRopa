import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  validarRun, validarNombre, validarEmail, validarPassword, validarConfirmacion
} from '../utils/validaciones'
import { registrarUsuario } from '../utils/usuarios'

const inicial = { run: '', nombre: '', correo: '', password: '', confirmar: '' }

const campos = [
  { name: 'run',       label: 'RUN',                type: 'text',     placeholder: 'Ej: 11111111-1',       validar: v => validarRun(v) },
  { name: 'nombre',    label: 'Nombre completo',    type: 'text',     placeholder: 'Ej: Veronica Aguilar', validar: v => validarNombre(v) },
  { name: 'correo',    label: 'Correo',             type: 'email',    placeholder: 'Ej: vero@gmail.com',   validar: v => validarEmail(v) },
  { name: 'password',  label: 'Contraseña',         type: 'password', placeholder: 'Mínimo 6 caracteres',  validar: v => validarPassword(v) },
  { name: 'confirmar', label: 'Repetir contraseña', type: 'password', placeholder: '',                     validar: (v, todos) => validarConfirmacion(todos.password, v) }
]

export default function CrearCuenta({ usuarios, onRegistrar }) {
  const navigate = useNavigate()
  const [valores, setValores] = useState(inicial)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')

  function manejarCambio(e) {
    setValores({ ...valores, [e.target.name]: e.target.value })
  }

  function manejarEnvio(e) {
    e.preventDefault()
    const nuevos = {}
    campos.forEach(c => { nuevos[c.name] = c.validar(valores[c.name], valores) })
    setErrores(nuevos)
    if (Object.values(nuevos).some(m => m !== '')) return

    const { run, nombre, correo, password } = valores
    const resultado = registrarUsuario(usuarios, { run, nombre, correo, password })
    if (!resultado.ok) {
      setErrorGeneral(resultado.error)
      return
    }
    onRegistrar(resultado.usuarios)
    navigate('/iniciar-sesion')
  }

  return (
    <div className="container py-4" style={{ maxWidth: '520px' }}>
      <h1 className="text-center mb-3">Crear cuenta</h1>
      <form onSubmit={manejarEnvio} noValidate>
        {campos.map(c => (
          <div className="mb-3" key={c.name}>
            <label htmlFor={c.name} className="form-label">{c.label}</label>
            <input
              id={c.name}
              name={c.name}
              type={c.type}
              placeholder={c.placeholder}
              className={`form-control ${errores[c.name] ? 'is-invalid' : ''}`}
              value={valores[c.name]}
              onChange={manejarCambio}
            />
            <div className="invalid-feedback">{errores[c.name]}</div>
          </div>
        ))}
        {errorGeneral && <div className="alert alert-danger" role="alert">{errorGeneral}</div>}
        <button type="submit" className="btn btn-primary w-100">Crear cuenta</button>
      </form>
      <p className="text-center mt-3">
        ¿Ya tienes cuenta? <Link to="/iniciar-sesion">Iniciar sesión</Link>
      </p>
    </div>
  )
}