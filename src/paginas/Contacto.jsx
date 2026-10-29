import { useState } from 'react'
import {
  validarNombre, validarEmail, validarTelefono, validarComuna
} from '../utils/validaciones'

const inicial = { nombre: '', email: '', telefono: '', comuna: '' }

const campos = [
  { name: 'nombre',   label: 'Nombre',   type: 'text',  placeholder: 'Ej: Veronica Aguilar',     autoComplete: 'name' },
  { name: 'email',    label: 'Email',    type: 'email', placeholder: 'Ej: vero@gmail.com', autoComplete: 'email' },
  { name: 'telefono', label: 'Teléfono', type: 'tel',   placeholder: 'Ej: 912345678',      autoComplete: 'tel' },
  { name: 'comuna',   label: 'Comuna',   type: 'text',  placeholder: 'Ej: Maipú',          autoComplete: 'address-level2' }
]

export default function Contacto() {
  const [valores, setValores] = useState(inicial)
  const [errores, setErrores] = useState({})
  const [enviado, setEnviado] = useState(false)

  function manejarCambio(e) {
    setValores({ ...valores, [e.target.name]: e.target.value })
    setEnviado(false)
  }

  function manejarEnvio(e) {
    e.preventDefault()
    const nuevosErrores = {
      nombre: validarNombre(valores.nombre),
      email: validarEmail(valores.email),
      telefono: validarTelefono(valores.telefono),
      comuna: validarComuna(valores.comuna)
    }
    setErrores(nuevosErrores)
    const hayErrores = Object.values(nuevosErrores).some(msg => msg !== '')
    if (!hayErrores) {
      setEnviado(true)
      setValores(inicial)
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: '560px' }}>
      <h1 className="text-center mb-3">Más información</h1>
      <p className="text-center">Déjanos tus datos y te contactaremos.</p>
      <form onSubmit={manejarEnvio} noValidate>
        {campos.map(c => (
          <div className="mb-3" key={c.name}>
            <label htmlFor={c.name} className="form-label">{c.label}</label>
            <input
              id={c.name}
              name={c.name}
              type={c.type}
              placeholder={c.placeholder}
              autoComplete={c.autoComplete}
              className={`form-control ${errores[c.name] ? 'is-invalid' : ''}`}
              value={valores[c.name]}
              onChange={manejarCambio}
            />
            <div className="invalid-feedback">{errores[c.name]}</div>
          </div>
        ))}
        <button type="submit" className="btn btn-primary w-100">Enviar</button>
      </form>
      {enviado && (
        <div className="alert alert-success mt-3" role="alert">
          ¡Gracias! Recibimos tus datos y te contactaremos pronto.
        </div>
      )}
    </div>
  )
}