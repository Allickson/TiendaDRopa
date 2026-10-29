'use client'
import { useState, type FormEvent } from 'react'
import CampoFormulario, { type EventoCampo } from '@/componentes/CampoFormulario'
import type { Resultado, Usuario, UsuarioPublico } from '@/tipos'
import {
  validarNombre, validarApellidos, validarEmail, validarPassword,
  validarConfirmacion, validarFormulario, hayErrores, type Errores, type Regla
} from '@/utils/validaciones'

interface Valores { nombre: string; apellidos: string; correo: string; password: string; confirmar: string }

interface Props {
  sesion: UsuarioPublico
  onGuardar: (datos: Partial<Usuario>) => Resultado
}

const reglas: Regla<Valores>[] = [
  { name: 'nombre', validar: validarNombre },
  { name: 'apellidos', validar: validarApellidos },
  { name: 'correo', validar: validarEmail },
  { name: 'password', validar: v => (v === '' ? '' : validarPassword(v)) },
  { name: 'confirmar', validar: (v, todos) => validarConfirmacion(todos.password, v) }
]

export default function AdminPerfil({ sesion, onGuardar }: Props) {
  const [valores, setValores] = useState<Valores>({
    nombre: sesion.nombre, apellidos: sesion.apellidos ?? '', correo: sesion.correo, password: '', confirmar: ''
  })
  const [errores, setErrores] = useState<Errores<Valores>>({})
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })

  function manejarCambio(e: EventoCampo) {
    setValores({ ...valores, [e.target.name]: e.target.value })
    setMensaje({ tipo: '', texto: '' })
  }

  function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    const nuevos = validarFormulario(reglas, valores)
    setErrores(nuevos)
    if (hayErrores(nuevos)) return
    const { confirmar: _c, ...datos } = valores
    const resultado = onGuardar(datos)
    setMensaje(resultado.ok ? { tipo: 'success', texto: 'Perfil actualizado.' } : { tipo: 'danger', texto: resultado.error })
    if (resultado.ok) setValores(v => ({ ...v, password: '', confirmar: '' }))
  }

  const campo = (name: keyof Valores, label: string, extra: Partial<Parameters<typeof CampoFormulario>[0]> = {}) => (
    <CampoFormulario name={name} label={label} value={valores[name]} onChange={manejarCambio}
      error={errores[name]} className="col-12 col-md-6 mb-3" {...extra} />
  )

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 className="h3">Mi perfil</h1>
      <p className="text-muted">RUN {sesion.run} · Rol {sesion.rol}</p>
      <form onSubmit={manejarEnvio} noValidate className="row">
        {campo('nombre', 'Nombre', { requerido: true })}
        {campo('apellidos', 'Apellidos', { requerido: true })}
        {campo('correo', 'Correo', { tipo: 'email', requerido: true, className: 'col-12 mb-3' })}
        {campo('password', 'Nueva contraseña (opcional)', { tipo: 'password' })}
        {campo('confirmar', 'Repetir contraseña', { tipo: 'password' })}
        {mensaje.texto && <div className="col-12"><div className={`alert alert-${mensaje.tipo}`} role="alert">{mensaje.texto}</div></div>}
        <div className="col-12"><button type="submit" className="btn btn-primary">Guardar cambios</button></div>
      </form>
    </div>
  )
}
