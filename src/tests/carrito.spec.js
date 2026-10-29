import {
  agregarAlCarrito, cambiarCantidad, eliminarDelCarrito, calcularTotal
} from '../utils/carrito'

describe('utils/carrito', () => {
  const polera = { id: 1, nombre: 'Polera', precio: 7990 }
  const falda = { id: 4, nombre: 'Falda', precio: 8990 }

  it('agrega un producto nuevo con cantidad 1', () => {
    const resultado = agregarAlCarrito([], polera)
    expect(resultado.length).toBe(1)
    expect(resultado[0].cantidad).toBe(1)
  })

  it('suma la cantidad si el producto ya estaba en el carrito', () => {
    const carrito = agregarAlCarrito([], polera)
    const resultado = agregarAlCarrito(carrito, polera)
    expect(resultado.length).toBe(1)
    expect(resultado[0].cantidad).toBe(2)
  })

  it('elimina un producto del carrito', () => {
    let carrito = agregarAlCarrito([], polera)
    carrito = agregarAlCarrito(carrito, falda)
    const resultado = eliminarDelCarrito(carrito, 1)
    expect(resultado.length).toBe(1)
    expect(resultado[0].id).toBe(4)
  })

  it('calcula el total como precio por cantidad', () => {
    let carrito = agregarAlCarrito([], polera)
    carrito = agregarAlCarrito(carrito, polera)
    carrito = agregarAlCarrito(carrito, falda)
    expect(calcularTotal(carrito)).toBe(7990 * 2 + 8990)
  })

  it('no deja bajar la cantidad de 1', () => {
    const carrito = agregarAlCarrito([], polera)
    const resultado = cambiarCantidad(carrito, 1, -1)
    expect(resultado[0].cantidad).toBe(1)
  })
})