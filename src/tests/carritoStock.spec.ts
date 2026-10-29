import { agregarAlCarrito, cambiarCantidad, contarItems, sincronizarCarrito } from '@/utils/carrito'

describe('carrito con límite de stock', () => {
  const falda = { id: 4, nombre: 'Falda', precio: 6990, stock: 2 }

  it('no agrega más unidades que el stock disponible', () => {
    let c = agregarAlCarrito([], falda)
    c = agregarAlCarrito(c, falda)
    c = agregarAlCarrito(c, falda)
    expect(c[0].cantidad).toBe(2)
  })

  it('no agrega un producto agotado', () => {
    expect(agregarAlCarrito([], { ...falda, stock: 0 })).toEqual([])
  })

  it('cambiarCantidad no supera el stock', () => {
    const c = cambiarCantidad([{ ...falda, cantidad: 2 }], 4, 1)
    expect(c[0].cantidad).toBe(2)
  })

  it('contarItems suma las cantidades', () => {
    expect(contarItems([{ cantidad: 2 }, { cantidad: 3 }])).toBe(5)
  })

  it('sincronizarCarrito ajusta cantidades, precios y quita productos sin stock', () => {
    const carrito = [{ ...falda, cantidad: 5 }, { id: 9, nombre: 'Borrado', precio: 1, cantidad: 1 }, { id: 2, precio: 1, cantidad: 1 }]
    const productos = [{ id: 4, precio: 8990, stock: 3 }, { id: 2, precio: 1, stock: 0 }]
    const r = sincronizarCarrito(carrito, productos)
    expect(r.length).toBe(1)
    expect(r[0].cantidad).toBe(3)
    expect(r[0].precio).toBe(8990)
  })
})
