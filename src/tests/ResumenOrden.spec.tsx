import { render, screen } from '@testing-library/react'
import ResumenOrden from '@/componentes/ResumenOrden'
import { ordenPagada } from './fixtures'

describe('ResumenOrden', () => {
  const orden = {
    ...ordenPagada,
    total: 18970,
    items: [...ordenPagada.items, { id: 4, nombre: 'Falda', precio: 6990, cantidad: 1, imagen: '/img/falda.png' }]
  }

  it('renderiza una fila por producto y los datos del cliente', () => {
    const { container } = render(<ResumenOrden orden={orden} />)
    expect(container.querySelectorAll('tbody tr').length).toBe(2)
    expect(screen.getByText('Maipú')).toBeTruthy()
    expect(screen.getByText('ORDER60001')).toBeTruthy()
  })

  it('dice "Total pagado" si la orden está pagada y "Total a pagar" si fue rechazada', () => {
    const { rerender } = render(<ResumenOrden orden={orden} />)
    expect(screen.getByText('Total pagado: $18.970')).toBeTruthy()
    rerender(<ResumenOrden orden={{ ...orden, estado: 'rechazada' }} />)
    expect(screen.getByText('Total a pagar: $18.970')).toBeTruthy()
  })

  it('muestra un guion en los campos opcionales vacíos', () => {
    render(<ResumenOrden orden={orden} />)
    expect(screen.getAllByText('—').length).toBe(2)
  })
})
