import { render, screen, fireEvent } from '@testing-library/react'
import Carrito from '@/paginas/Carrito'
import type { ItemCarrito } from '@/tipos'

describe('Carrito (eventos)', () => {
  const carrito: ItemCarrito[] = [
    { id: 1, nombre: 'Polera', precio: 5990, cantidad: 2, stock: 20, imagen: '/img/polera.png' },
    { id: 4, nombre: 'Falda', precio: 6990, cantidad: 3, stock: 3, imagen: '/img/falda.png' }
  ]
  const boton = (label: string) => screen.getByLabelText(label) as HTMLButtonElement

  function dibujar() {
    const espias = {
      onCambiarCantidad: jasmine.createSpy('onCambiarCantidad'),
      onEliminar: jasmine.createSpy('onEliminar'),
      onVaciar: jasmine.createSpy('onVaciar')
    }
    render(<Carrito carrito={carrito} {...espias} />)
    return espias
  }

  it('muestra el total del carrito', () => {
    dibujar()
    expect(screen.getByText('Total: $32.950')).toBeTruthy()
  })

  it('el botón + llama a onCambiarCantidad con el id y +1', () => {
    const { onCambiarCantidad } = dibujar()
    fireEvent.click(boton('Agregar una unidad de Polera'))
    expect(onCambiarCantidad).toHaveBeenCalledWith(1, 1)
  })

  it('deshabilita + cuando la cantidad llegó al stock', () => {
    dibujar()
    expect(boton('Agregar una unidad de Falda').disabled).toBeTrue()
    expect(screen.getByText('Máximo disponible')).toBeTruthy()
  })

  it('eliminar y vaciar llaman a sus funciones', () => {
    const { onEliminar, onVaciar } = dibujar()
    fireEvent.click(screen.getAllByText('Eliminar')[1])
    fireEvent.click(screen.getByText('Vaciar carrito'))
    expect(onEliminar).toHaveBeenCalledWith(4)
    expect(onVaciar).toHaveBeenCalled()
  })

  it('con el carrito vacío muestra el aviso y no la tabla', () => {
    const { container } = render(<Carrito carrito={[]} />)
    expect(screen.getByText('El carrito está vacío.')).toBeTruthy()
    expect(container.querySelector('table')).toBeNull()
  })
})
