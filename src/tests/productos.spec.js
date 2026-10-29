import {
  precioFinal, filtrarProductos, productosEnOferta,
  validarProducto, guardarProducto, eliminarProducto
} from '../utils/productos'
import { hayStock, descontarStock } from '../utils/carrito'
import { productos } from '../data/productos'

describe('utils/productos', () => {
  it('precioFinal usa el precio de oferta si existe', () => {
    expect(precioFinal({ precio: 1000, precioOferta: 800 })).toBe(800)
    expect(precioFinal({ precio: 1000 })).toBe(1000)
  })

  it('filtrarProductos filtra por texto y categoría', () => {
    const r = filtrarProductos(productos, { texto: 'pol', categoria: 'Superior' })
    expect(r.length).toBe(2)
  })

  it('productosEnOferta devuelve solo los que tienen oferta', () => {
    expect(productosEnOferta(productos).every(p => p.precioOferta > 0)).toBeTrue()
  })

  it('validarProducto detecta una oferta mayor al precio', () => {
    const datos = { nombre: 'Abrigo', precio: '100', stock: '2', precioOferta: '200' }
    expect(validarProducto(datos)).not.toBe('')
  })

  it('guardarProducto crea con id nuevo y edita uno existente', () => {
    const datos = { nombre: 'Abrigo', categoria: 'Superior', precio: '100', stock: '2', precioOferta: '', imagen: '', descripcion: '' }
    const conNuevo = guardarProducto(productos, datos)
    expect(conNuevo.length).toBe(productos.length + 1)
    const editado = guardarProducto(productos, { ...datos, nombre: 'Editado' }, 1)
    expect(editado.find(p => p.id === 1).nombre).toBe('Editado')
  })

  it('eliminarProducto quita el producto por id', () => {
    expect(eliminarProducto(productos, 1).some(p => p.id === 1)).toBeFalse()
  })
})

describe('stock del carrito', () => {
  it('hayStock es false si se pide más de lo disponible', () => {
    expect(hayStock([{ id: 1, cantidad: 2 }], productos)).toBeTrue()
    expect(hayStock([{ id: 1, cantidad: 999 }], productos)).toBeFalse()
  })

  it('descontarStock resta las cantidades compradas', () => {
    const r = descontarStock(productos, [{ id: 1, cantidad: 3 }])
    expect(r.find(p => p.id === 1).stock).toBe(productos[0].stock - 3)
  })
})