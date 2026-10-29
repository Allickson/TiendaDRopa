'use client'
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Usuario, UsuarioPublico } from '@/tipos'
import { autenticar, datosPublicos } from '@/utils/usuarios'

interface Props {
  usuarios: Usuario[]
  onIngresar: (usuario: UsuarioPublico) => void
}

export default function IniciarSesion({ usuarios, onIngresar }: Props) {
  const router = useRouter()
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    const usuario = autenticar(usuarios, correo, password)
    if (!usuario) {
      setError('Correo o contraseña incorrectos')
      return
    }
    onIngresar(datosPublicos(usuario))
    router.push(usuario.rol === 'admin' ? '/admin' : '/')
  }

  return (
    <div className="container py-4" style={{ maxWidth: '460px' }}>
      <h1 className="text-center mb-3">Iniciar sesión</h1>
      <form onSubmit={manejarEnvio} noValidate>
        <div className="mb-3">
          <label htmlFor="correo" className="form-label">Correo</label>
          <input id="correo" type="email" className="form-control" autoComplete="email"
            value={correo} onChange={e => setCorreo(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input id="password" type="password" className="form-control" autoComplete="current-password"
            value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <button type="submit" className="btn btn-primary w-100">Ingresar</button>
      </form>
      <p className="text-center mt-3">¿No tienes cuenta? <Link href="/crear-cuenta">Crear cuenta</Link></p>
    </div>
  )
}
