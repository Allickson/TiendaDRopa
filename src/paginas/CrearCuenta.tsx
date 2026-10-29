'use client'
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CampoFormulario, { type EventoCampo } from '@/componentes/CampoFormulario'
import type { Resultado, Usuario } from '@/tipos'
import {
  validarRun, validarNombre, validarApellidos, validarEmail, validarPassword,
  validarConfirmacion, validarFormulario, hayErrores, type Errores, type Regla
} from '@/utils/validaciones'

interface Valores { run: string; nombre: string; apellidos: string; correo: string; password: string; confirmar: string }

const inicial: Valores = { run: '', nombre: '', apellidos: '', correo: '', password: '', confirmar: '' }

const campos: (Regla<Valores> & { label: string; tipo: 'text' | 'email' | 'password'; placeholder: string })[] = [
  { name: 'run',       label: 'RUN',                tipo: 'text',     placeholder: 'Ej: 11111111-1',      validar: validarRun },
  { name: 'nombre',    label: 'Nombre',             tipo: 'text',     placeholder: 'Ej: Veronica',        validar: validarNombre },
  { name: 'apellidos', label: 'Apellidos',          tipo: 'text',     placeholder: 'Ej: Aguilar Soto',    validar: validarApellidos },
  { name: 'correo',    label: 'Correo',             tipo: 'email',    placeholder: 'Ej: vero@gmail.com',  validar: validarEmail },
  { name: 'password',  label: 'Contraseña',         tipo: 'password', placeholder: 'Mínimo 6 caracteres', validar: validarPassword },
  { name: 'confirmar', label: 'Repetir contraseña', tipo: 'password', placeholder: '',                    validar: (v, todos) => validarConfirmacion(todos.password, v) }
]

interface Props {
  onRegistrar: (datos: Omit<Usuario, 'rol'>) => Resultado
}

export default function CrearCuenta({ onRegistrar }: Props) {
  const router = useRouter()
  const [valores, setValores] = useState<Valores>(inicial)
  const [errores, setErrores] = useState<Errores<Valores>>({})
  const [errorGeneral, setErrorGeneral] = useState('')

  function manejarCambio(e: EventoCampo) {
    setValores({ ...valores, [e.target.name]: e.target.value })
  }

  function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    const nuevos = validarFormulario(campos, valores)
    setErrores(nuevos)
    if (hayErrores(nuevos)) return

    const { confirmar: _c, ...datos } = valores
    const resultado = onRegistrar(datos)
    if (!resultado.ok) {
      setErrorGeneral(resultado.error)
      return
    }
    router.push('/iniciar-sesion')
  }

  return (
    <div className="container py-4" style={{ maxWidth: '520px' }}>
      <h1 className="text-center mb-3">Crear cuenta</h1>
      <form onSubmit={manejarEnvio} noValidate>
        {campos.map(c => (
          <CampoFormulario key={c.name} name={c.name} label={c.label} tipo={c.tipo} placeholder={c.placeholder}
            value={valores[c.name]} onChange={manejarCambio} error={errores[c.name]} requerido />
        ))}
        {errorGeneral && <div className="alert alert-danger" role="alert">{errorGeneral}</div>}
        <button type="submit" className="btn btn-primary w-100">Crear cuenta</button>
      </form>
      <p className="text-center mt-3">¿Ya tienes cuenta? <Link href="/iniciar-sesion">Iniciar sesión</Link></p>
    </div>
  )
}
