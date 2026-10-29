import { render, screen, fireEvent } from '@testing-library/react'
import ProductCard from '../componentes/ProductCard'

describe('ProductCard', () => {
  const producto = { id: 1, nombre: 'Polera', precio: 7990, imagen: '/img/polera.png' }

  it('muestra el nombre y el precio formateado', () => {
    render(<ProductCard producto={producto} onAgregar={() => {}} />)
    expect(screen.getByText('Polera')).toBeTruthy()
    expect(screen.getByText('$7.990')).toBeTruthy()
  })

  it('llama a onAgregar con el producto al hacer clic (spy)', () => {
    const onAgregar = jasmine.createSpy('onAgregar')
    render(<ProductCard producto={producto} onAgregar={onAgregar} />)
    fireEvent.click(screen.getByText('Agregar'))
    expect(onAgregar).toHaveBeenCalledTimes(1)
    expect(onAgregar).toHaveBeenCalledWith(producto)
  })
})