import { render, screen, fireEvent } from '@testing-library/react'
import ListaProductos from '@/componentes/ListaProductos'
import { productos } from '@/data/productos'
import { configurarRuta, ultimaRuta } from './mocks/next-navigation'

describe('ListaProductos (renderizado de listas)', () => {
  beforeEach(() => configurarRuta())

  it('renderiza una tarjeta por cada producto del conjunto de datos', () => {
    const { container } = render(<ListaProductos productos={productos} onAgregar={() => {}} />)
    expect(container.querySelectorAll('.card-producto').length).toBe(productos.length)
    productos.forEach(p => expect(screen.getByRole('heading', { name: p.nombre })).toBeTruthy())
  })

  it('muestra el mensaje vacío solo cuando no hay productos', () => {
    render(<ListaProductos productos={[]} onAgregar={() => {}} mensajeVacio="Nada por aquí" />)
    expect(screen.getByRole('status').textContent).toBe('Nada por aquí')
  })

  it('no muestra el mensaje vacío si hay productos', () => {
    render(<ListaProductos productos={productos.slice(0, 1)} onAgregar={() => {}} mensajeVacio="Nada por aquí" />)
    expect(screen.queryByText('Nada por aquí')).toBeNull()
  })

  it('el botón Ver navega al detalle del producto (mock del router)', () => {
    render(<ListaProductos productos={productos.slice(0, 1)} onAgregar={() => {}} />)
    fireEvent.click(screen.getByText('Ver'))
    expect(ultimaRuta()).toBe('/producto/1')
  })
})
