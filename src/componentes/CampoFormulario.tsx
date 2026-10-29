import type { ChangeEvent } from 'react'

export type EventoCampo = ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>

interface Props {
  name: string
  label: string
  tipo?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'select' | 'textarea'
  value: string
  onChange: (e: EventoCampo) => void
  error?: string
  opciones?: string[]
  placeholder?: string
  requerido?: boolean
  deshabilitado?: boolean
  autoComplete?: string
  className?: string
}

// Campo de formulario Bootstrap con su etiqueta y mensaje de error.
export default function CampoFormulario({
  name, label, tipo = 'text', value, onChange, error = '',
  opciones = [], placeholder = '', requerido = false, deshabilitado = false,
  autoComplete, className = 'mb-3'
}: Props) {
  const clase = `${tipo === 'select' ? 'form-select' : 'form-control'} ${error ? 'is-invalid' : ''}`
  const comunes = { id: name, name, value, onChange, className: clase, disabled: deshabilitado, 'aria-invalid': Boolean(error) }

  let control
  if (tipo === 'select') {
    control = (
      <select {...comunes}>
        <option value="">{placeholder || 'Seleccione...'}</option>
        {opciones.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    )
  } else if (tipo === 'textarea') {
    control = <textarea {...comunes} rows={3} placeholder={placeholder} />
  } else {
    control = <input {...comunes} type={tipo} placeholder={placeholder} autoComplete={autoComplete} />
  }

  return (
    <div className={className}>
      <label htmlFor={name} className="form-label">
        {label}{requerido && <span className="text-danger" aria-hidden="true"> *</span>}
      </label>
      {control}
      <div className="invalid-feedback">{error}</div>
    </div>
  )
}
