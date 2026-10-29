'use client'
import { useState, type FormEvent } from 'react'
import type { Producto, Resultado } from '@/tipos'
import { validarCategoria, contarPorCategoria } from '@/utils/categorias'

interface Props {
  categorias: string[]
  productos: Pick<Producto, 'categoria'>[]
  onAgregar: (nombre: string) => void
  onRenombrar: (actual: string, nuevo: string) => void
  onEliminar: (nombre: string) => Resultado
}

export default function AdminCategorias({ categorias, productos, onAgregar, onRenombrar, onEliminar }: Props) {
  const [nueva, setNueva] = useState('')
  const [editando, setEditando] = useState<string | null>(null) // categoría en edición
  const [texto, setTexto] = useState('')
  const [error, setError] = useState('')

  function agregar(e: FormEvent) {
    e.preventDefault()
    const mensaje = validarCategoria(categorias, nueva)
    if (mensaje) return setError(mensaje)
    onAgregar(nueva)
    setNueva('')
    setError('')
  }

  function guardar(actual: string) {
    const mensaje = validarCategoria(categorias, texto, actual)
    if (mensaje) return setError(mensaje)
    onRenombrar(actual, texto)
    setEditando(null)
    setError('')
  }

  function eliminar(nombre: string) {
    const resultado = onEliminar(nombre)
    setError(resultado.ok ? '' : resultado.error)
  }

  return (
    <div style={{ maxWidth: '760px' }}>
      <h1 className="h3">Categorías</h1>
      <form onSubmit={agregar} noValidate className="d-flex gap-2 mb-3">
        <label htmlFor="nuevaCategoria" className="visually-hidden">Nueva categoría</label>
        <input id="nuevaCategoria" className="form-control" placeholder="Nueva categoría"
          value={nueva} onChange={e => setNueva(e.target.value)} />
        <button type="submit" className="btn btn-primary text-nowrap">Agregar categoría</button>
      </form>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <ul className="list-group">
        {categorias.map(c => (
          <li key={c} className="list-group-item d-flex flex-wrap justify-content-between align-items-center gap-2">
            {editando === c ? (
              <input className="form-control w-auto flex-grow-1" aria-label={`Nuevo nombre para ${c}`}
                value={texto} onChange={e => setTexto(e.target.value)} />
            ) : (
              <span>{c} <small className="text-muted">({contarPorCategoria(productos, c)} productos)</small></span>
            )}
            <span className="d-flex gap-1">
              {editando === c ? (
                <>
                  <button className="btn btn-primary btn-sm" onClick={() => guardar(c)}>Guardar</button>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => { setEditando(null); setError('') }}>Cancelar</button>
                </>
              ) : (
                <>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => { setEditando(c); setTexto(c) }}>Editar</button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => eliminar(c)}>Eliminar</button>
                </>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
