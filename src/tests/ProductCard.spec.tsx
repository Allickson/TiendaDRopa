import { render, screen, fireEvent } from '@testing-library/react'
import ProductCard from '@/componentes/ProductCard'

describe('ProductCard (props y eventos)', () => {
  const producto = { id: 1, nombre: 'Polera', precio: 7990, imagen: '/img/polera.png', stock: 3 }

  it('muestra el nombre y el precio formateado', () => {
    render(<ProductCard producto={producto} onAgregar={() => {}} />)
    expect(screen.getByText('Polera')).toBeTruthy()
    expect(screen.getByText('$7.990')).toBeTruthy()
  })

  it('llama a onAgregar con el producto al hacer clic (spy)', () => {
    const onAgregar = jasmine.createSpy('onAgregar')
    render(<ProductCard producto={producto} onAgregar={onAgregar} />)
    fireEvent.click(screen.getByText('Agregar'))
    expect(onAgregar).toHaveBeenCalledOnceWith(producto)
  })

  it('con precio de oferta muestra la insignia y el precio anterior tachado', () => {
    render(<ProductCard producto={{ ...producto, precioOferta: 5990 }} onAgregar={() => {}} />)
    expect(screen.getByText('Oferta')).toBeTruthy()
    expect(screen.getByText('$7.990').classList.contains('text-decoration-line-through')).toBeTrue()
    expect(screen.getByText('$5.990')).toBeTruthy()
  })

  it('si está agotado deshabilita el botón', () => {
    render(<ProductCard producto={{ ...producto, stock: 0 }} onAgregar={() => {}} />)
    expect((screen.getByText('Agotado') as HTMLButtonElement).disabled).toBeTrue()
  })

  it('el botón Ver solo aparece si recibe onVer', () => {
    const onVer = jasmine.createSpy('onVer')
    const { rerender } = render(<ProductCard producto={producto} onAgregar={() => {}} />)
    expect(screen.queryByText('Ver')).toBeNull()
    rerender(<ProductCard producto={producto} onAgregar={() => {}} onVer={onVer} />)
    fireEvent.click(screen.getByText('Ver'))
    expect(onVer).toHaveBeenCalled()
  })
})
