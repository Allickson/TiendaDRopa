'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Resultado, Usuario, UsuarioPublico } from '@/tipos'
import { nombreCompleto } from '@/utils/usuarios'

interface Props {
  usuarios: Usuario[]
  sesion: Pick<UsuarioPublico, 'run'>
  onEliminar: (run: string) => Resultado
}

export default function AdminUsuarios({ usuarios, sesion, onEliminar }: Props) {
  const [error, setError] = useState('')

  function eliminar(usuario: Usuario) {
    if (!window.confirm(`¿Eliminar la cuenta de ${nombreCompleto(usuario)}?`)) return
    const resultado = onEliminar(usuario.run)
    setError(resultado.ok ? '' : resultado.error)
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">Usuarios</h1>
        <Link href="/admin/usuarios/nuevo" className="btn btn-primary">Nuevo usuario</Link>
      </div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="table-responsive">
        <table className="table align-middle">
          <thead><tr><th>RUN</th><th>Nombre</th><th>Correo</th><th>Rol</th><th></th></tr></thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.run}>
                <td>{u.run}</td>
                <td>{nombreCompleto(u)}{u.run === sesion.run && <small className="text-muted"> (tú)</small>}</td>
                <td>{u.correo}</td>
                <td><span className={`badge ${u.rol === 'admin' ? 'text-bg-dark' : 'text-bg-secondary'}`}>{u.rol}</span></td>
                <td className="text-nowrap">
                  <Link href={`/admin/usuarios/${u.run}`} className="btn btn-outline-secondary btn-sm me-1">Ver</Link>
                  <Link href={`/admin/usuarios/${u.run}/editar`} className="btn btn-outline-secondary btn-sm me-1">Editar</Link>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => eliminar(u)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
