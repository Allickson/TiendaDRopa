'use client'
import { useState, type FormEvent } from 'react'
import CampoFormulario, { type EventoCampo } from '@/componentes/CampoFormulario'
import {
  validarNombre, validarEmail, validarTelefono, validarComuna,
  validarFormulario, hayErrores, type Errores, type Regla
} from '@/utils/validaciones'

interface Valores { nombre: string; email: string; telefono: string; comuna: string }

const inicial: Valores = { nombre: '', email: '', telefono: '', comuna: '' }

const campos: (Regla<Valores> & { label: string; tipo: 'text' | 'email' | 'tel'; placeholder: string; autoComplete: string })[] = [
  { name: 'nombre',   label: 'Nombre',   tipo: 'text',  placeholder: 'Ej: Veronica Aguilar', autoComplete: 'name',           validar: validarNombre },
  { name: 'email',    label: 'Email',    tipo: 'email', placeholder: 'Ej: vero@gmail.com',   autoComplete: 'email',          validar: validarEmail },
  { name: 'telefono', label: 'Teléfono', tipo: 'tel',   placeholder: 'Ej: 912345678',        autoComplete: 'tel',            validar: validarTelefono },
  { name: 'comuna',   label: 'Comuna',   tipo: 'text',  placeholder: 'Ej: Maipú',            autoComplete: 'address-level2', validar: validarComuna }
]

export default function Contacto() {
  const [valores, setValores] = useState<Valores>(inicial)
  const [errores, setErrores] = useState<Errores<Valores>>({})
  const [enviado, setEnviado] = useState(false)

  function manejarCambio(e: EventoCampo) {
    setValores({ ...valores, [e.target.name]: e.target.value })
    setEnviado(false)
  }

  function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    const nuevos = validarFormulario(campos, valores)
    setErrores(nuevos)
    if (!hayErrores(nuevos)) {
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
          <CampoFormulario key={c.name} name={c.name} label={c.label} tipo={c.tipo} placeholder={c.placeholder}
            autoComplete={c.autoComplete} value={valores[c.name]} onChange={manejarCambio} error={errores[c.name]} />
        ))}
        <button type="submit" className="btn btn-primary w-100">Enviar</button>
      </form>
      {enviado && (
        <div className="alert alert-success mt-3" role="alert">¡Gracias! Recibimos tus datos y te contactaremos pronto.</div>
      )}
    </div>
  )
}
