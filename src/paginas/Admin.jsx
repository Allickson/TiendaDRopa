import { useState } from 'react'
import { imagenes, categorias } from '../data/productos'
import { validarProducto, guardarProducto, eliminarProducto } from '../utils/productos'

const vacio = {
  nombre: '', categoria: categorias[0], precio: '', precioOferta: '',
  stock: '', imagen: '/img/polera.png', descripcion: ''
}

export default function Admin({ productos, onCambiarProductos }) {
  const [form, setForm] = useState(vacio)
  const [editandoId, setEditandoId] = useState(null)
  const [error, setError] = useState('')

  const unidades = productos.reduce((suma, p) => suma + p.stock, 0)
  const enOferta = productos.filter(p => p.precioOferta > 0).length

  function manejarCambio(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function limpiar() {
    setForm(vacio)
    setEditandoId(null)
    setError('')
  }

  function manejarEnvio(e) {
    e.preventDefault()
    const mensaje = validarProducto(form)
    if (mensaje) {
      setError(mensaje)
      return
    }
    onCambiarProductos(guardarProducto(productos, form, editandoId))
    limpiar()
  }

  function editar(producto) {
    setForm({
      ...producto,
      precio: String(producto.precio),
      stock: String(producto.stock),
      precioOferta: producto.precioOferta ? String(producto.precioOferta) : ''
    })
    setEditandoId(producto.id)
    setError('')
  }

  function eliminar(producto) {
    if (window.confirm(`¿Eliminar "${producto.nombre}"?`)) {
      onCambiarProductos(eliminarProducto(productos, producto.id))
      if (editandoId === producto.id) limpiar()
    }
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Panel de administración</h1>

      <div className="row g-3 mb-4 text-center">
        <div className="col-12 col-md-4"><div className="card card-body"><h2 className="h3">{productos.length}</h2><p className="mb-0">Productos</p></div></div>
        <div className="col-12 col-md-4"><div className="card card-body"><h2 className="h3">{unidades}</h2><p className="mb-0">Unidades en stock</p></div></div>
        <div className="col-12 col-md-4"><div className="card card-body"><h2 className="h3">{enOferta}</h2><p className="mb-0">En oferta</p></div></div>
      </div>

      <h2 className="h4">{editandoId === null ? 'Nuevo producto' : 'Editar producto'}</h2>
      <form onSubmit={manejarEnvio} noValidate className="row g-2 mb-4">
        <div className="col-12 col-md-6">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input id="nombre" name="nombre" className="form-control" value={form.nombre} onChange={manejarCambio} />
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="categoria" className="form-label">Categoría</label>
          <select id="categoria" name="categoria" className="form-select" value={form.categoria} onChange={manejarCambio}>
            {categorias.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="col-6 col-md-3">
          <label htmlFor="precio" className="form-label">Precio</label>
          <input id="precio" name="precio" type="number" className="form-control" value={form.precio} onChange={manejarCambio} />
        </div>
        <div className="col-6 col-md-3">
          <label htmlFor="precioOferta" className="form-label">Precio oferta (opcional)</label>
          <input id="precioOferta" name="precioOferta" type="number" className="form-control" value={form.precioOferta} onChange={manejarCambio} />
        </div>
        <div className="col-6 col-md-3">
          <label htmlFor="stock" className="form-label">Stock</label>
          <input id="stock" name="stock" type="number" className="form-control" value={form.stock} onChange={manejarCambio} />
        </div>
        <div className="col-6 col-md-3">
          <label htmlFor="imagen" className="form-label">Imagen</label>
          <select id="imagen" name="imagen" className="form-select" value={form.imagen} onChange={manejarCambio}>
            {imagenes.map(i => <option key={i} value={`/img/${i}.png`}>{i}</option>)}
          </select>
        </div>
        <div className="col-12">
          <label htmlFor="descripcion" className="form-label">Descripción</label>
          <textarea id="descripcion" name="descripcion" rows="2" className="form-control" value={form.descripcion} onChange={manejarCambio} />
        </div>
        {error && <div className="col-12"><div className="alert alert-danger mb-0" role="alert">{error}</div></div>}
        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-primary">{editandoId === null ? 'Agregar producto' : 'Guardar cambios'}</button>
          {editandoId !== null && <button type="button" className="btn btn-outline-secondary" onClick={limpiar}>Cancelar</button>}
        </div>
      </form>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Oferta</th><th>Stock</th><th></th></tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>${p.precio.toLocaleString('es-CL')}</td>
                <td>{p.precioOferta > 0 ? `$${p.precioOferta.toLocaleString('es-CL')}` : '-'}</td>
                <td>{p.stock}</td>
                <td className="text-nowrap">
                  <button className="btn btn-outline-secondary btn-sm me-1" onClick={() => editar(p)}>Editar</button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => eliminar(p)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}