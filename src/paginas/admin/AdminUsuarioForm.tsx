'use client'
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import CampoFormulario, { type EventoCampo } from '@/componentes/CampoFormulario'
import type { DatosUsuarioForm } from '@/context/TiendaContext'
import type { Resultado, Usuario } from '@/tipos'
import { buscarUsuario } from '@/utils/usuarios'
import {
  validarRun, validarNombre, validarApellidos, validarEmail, validarPassword,
  validarFormulario, hayErrores, type Errores, type Regla
} from '@/utils/validaciones'

interface Props {
  usuarios: Usuario[]
  onGuardar: (datos: DatosUsuarioForm, run: string | null) => Resultado
}

// Crea (/admin/usuarios/nuevo) o edita (/admin/usuarios/[run]/editar) un usuario
export default function AdminUsuarioForm({ usuarios, onGuardar }: Props) {
  const { run } = useParams<{ run: string }>()
  const router = useRouter()
  const existente = run ? buscarUsuario(usuarios, run) : null
  const [valores, setValores] = useState<DatosUsuarioForm>(() => ({
    run: existente?.run ?? '',
    nombre: existente?.nombre ?? '',
    apellidos: existente?.apellidos ?? '',
    correo: existente?.correo ?? '',
    rol: existente?.rol ?? 'cliente',
    password: ''
  }))
  const [errores, setErrores] = useState<Errores<DatosUsuarioForm>>({})
  const [errorGeneral, setErrorGeneral] = useState('')

  if (run && !existente) {
    return (
      <>
        <h1 className="h3">Usuario no encontrado</h1>
        <Link href="/admin/usuarios" className="btn btn-primary">Volver</Link>
      </>
    )
  }

  const reglas: Regla<DatosUsuarioForm>[] = [
    { name: 'run', validar: v => (existente ? '' : validarRun(v)) },
    { name: 'nombre', validar: validarNombre },
    { name: 'apellidos', validar: validarApellidos },
    { name: 'correo', validar: validarEmail },
    // Al editar, la contraseña es opcional: vacía significa "no cambiar"
    { name: 'password', validar: v => (existente && v === '' ? '' : validarPassword(v)) }
  ]

  function manejarCambio(e: EventoCampo) {
    setValores({ ...valores, [e.target.name]: e.target.value })
  }

  function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    const nuevos = validarFormulario(reglas, valores)
    setErrores(nuevos)
    if (hayErrores(nuevos)) return
    const resultado = onGuardar(valores, existente ? existente.run : null)
    if (!resultado.ok) return setErrorGeneral(resultado.error)
    router.push('/admin/usuarios')
  }

  const campo = (name: keyof DatosUsuarioForm, label: string, extra: Partial<Parameters<typeof CampoFormulario>[0]> = {}) => (
    <CampoFormulario name={name} label={label} value={valores[name]} onChange={manejarCambio}
      error={errores[name]} className="col-12 col-md-6 mb-3" {...extra} />
  )

  return (
    <div style={{ maxWidth: '800px' }}>
      <Link href="/admin/usuarios">‹ Volver a usuarios</Link>
      <h1 className="h3 mt-2">{existente ? 'Editar usuario' : 'Nuevo usuario'}</h1>
      <form onSubmit={manejarEnvio} noValidate className="row">
        {campo('run', 'RUN', { requerido: true, deshabilitado: Boolean(existente), placeholder: 'Ej: 11111111-1' })}
        {campo('rol', 'Rol', { tipo: 'select', opciones: ['cliente', 'admin'], requerido: true })}
        {campo('nombre', 'Nombre', { requerido: true })}
        {campo('apellidos', 'Apellidos', { requerido: true })}
        {campo('correo', 'Correo', { tipo: 'email', requerido: true })}
        {campo('password', existente ? 'Nueva contraseña (opcional)' : 'Contraseña', { tipo: 'password', requerido: !existente })}
        {errorGeneral && <div className="col-12"><div className="alert alert-danger" role="alert">{errorGeneral}</div></div>}
        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-primary">{existente ? 'Guardar cambios' : 'Crear usuario'}</button>
          <Link href="/admin/usuarios" className="btn btn-outline-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  )
}
