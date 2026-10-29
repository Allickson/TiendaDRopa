'use client'
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import CampoFormulario, { type EventoCampo } from '@/componentes/CampoFormulario'
import type { DatosProducto, Producto } from '@/tipos'
import { imagenes } from '@/data/productos'
import { buscarProducto, validarProducto } from '@/utils/productos'

const vacio: DatosProducto = { nombre: '', categoria: '', precio: '', precioOferta: '', stock: '', imagen: '/img/polera.png', descripcion: '' }

function aFormulario(producto: Producto | null, categoriaPorDefecto: string): DatosProducto {
  if (!producto) return { ...vacio, categoria: categoriaPorDefecto }
  return {
    nombre: producto.nombre,
    categoria: producto.categoria,
    imagen: producto.imagen,
    descripcion: producto.descripcion,
    precio: String(producto.precio),
    stock: String(producto.stock),
    precioOferta: producto.precioOferta ? String(producto.precioOferta) : ''
  }
}

interface Props {
  productos: Producto[]
  categorias: string[]
  onGuardar: (datos: DatosProducto, id: number | null) => void
}

// Sirve para crear (/admin/productos/nuevo) y editar (/admin/productos/[id]/editar)
export default function AdminProductoForm({ productos, categorias, onGuardar }: Props) {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const existente = id ? buscarProducto(productos, id) : null
  const [form, setForm] = useState<DatosProducto>(() => aFormulario(existente, categorias[0] ?? ''))
  const [error, setError] = useState('')

  if (id && !existente) {
    return (
      <>
        <h1 className="h3">Producto no encontrado</h1>
        <Link href="/admin/productos" className="btn btn-primary">Volver</Link>
      </>
    )
  }

  function manejarCambio(e: EventoCampo) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    const mensaje = validarProducto(form)
    if (mensaje) {
      setError(mensaje)
      return
    }
    onGuardar(form, existente ? existente.id : null)
    router.push('/admin/productos')
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <Link href="/admin/productos">‹ Volver a productos</Link>
      <h1 className="h3 mt-2">{existente ? `Editar ${existente.nombre}` : 'Nuevo producto'}</h1>
      <form onSubmit={manejarEnvio} noValidate className="row">
        <CampoFormulario name="nombre" label="Nombre" value={form.nombre} onChange={manejarCambio} requerido className="col-12 col-md-6 mb-3" />
        <CampoFormulario name="categoria" label="Categoría" tipo="select" opciones={categorias} value={form.categoria} onChange={manejarCambio} requerido className="col-12 col-md-6 mb-3" />
        <CampoFormulario name="precio" label="Precio" tipo="number" value={form.precio} onChange={manejarCambio} requerido className="col-6 col-md-3 mb-3" />
        <CampoFormulario name="precioOferta" label="Precio oferta" tipo="number" value={form.precioOferta} onChange={manejarCambio} className="col-6 col-md-3 mb-3" />
        <CampoFormulario name="stock" label="Stock" tipo="number" value={form.stock} onChange={manejarCambio} requerido className="col-6 col-md-3 mb-3" />
        <div className="col-6 col-md-3 mb-3">
          <label htmlFor="imagen" className="form-label">Imagen</label>
          <select id="imagen" name="imagen" className="form-select" value={form.imagen} onChange={manejarCambio}>
            {imagenes.map(i => <option key={i} value={`/img/${i}.png`}>{i}</option>)}
          </select>
        </div>
        <CampoFormulario name="descripcion" label="Descripción" tipo="textarea" value={form.descripcion} onChange={manejarCambio} className="col-12 mb-3" />
        {error && <div className="col-12"><div className="alert alert-danger" role="alert">{error}</div></div>}
        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-primary">{existente ? 'Guardar cambios' : 'Agregar producto'}</button>
          <Link href="/admin/productos" className="btn btn-outline-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  )
}
