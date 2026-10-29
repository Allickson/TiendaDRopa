import { render, screen, fireEvent } from '@testing-library/react'
import Navbar from '@/componentes/Navbar'
import { configurarRuta, ultimaRuta } from './mocks/next-navigation'

describe('Navbar (renderizado condicional según sesión)', () => {
  beforeEach(() => configurarRuta({ pathname: '/' }))
  type Props = Partial<Parameters<typeof Navbar>[0]>

  function dibujar(props: Props = {}) {
    render(<Navbar categorias={['Superior']} totalItems={3} totalPrecio={15000} onSalir={() => {}} {...props} />)
  }

  it('sin sesión muestra los botones de ingreso y no el enlace Admin', () => {
    dibujar({ sesion: null })
    expect(screen.getByText('Iniciar sesión')).toBeTruthy()
    expect(screen.queryByText('Admin')).toBeNull()
  })

  it('con sesión de admin muestra el saludo y el enlace Admin', () => {
    dibujar({ sesion: { nombre: 'Admin Pinkie', rol: 'admin' } })
    expect(screen.getByText('Hola, Admin')).toBeTruthy()
    expect(screen.getByText('Admin')).toBeTruthy()
  })

  it('con sesión de cliente no muestra el enlace Admin', () => {
    dibujar({ sesion: { nombre: 'Ana', rol: 'cliente' } })
    expect(screen.queryByText('Admin')).toBeNull()
  })

  it('muestra la cantidad y el total del carrito', () => {
    dibujar()
    expect(screen.getByRole('link', { name: /Carrito 3 \$15\.000/ })).toBeTruthy()
  })

  it('lista las categorías recibidas en el menú', () => {
    dibujar({ categorias: ['Superior', 'Inferior'] })
    expect(screen.getByText('Inferior').getAttribute('href')).toBe('/categorias/Inferior')
  })

  it('el botón Salir llama a onSalir (spy)', () => {
    const onSalir = jasmine.createSpy('onSalir')
    dibujar({ sesion: { nombre: 'Ana', rol: 'cliente' }, onSalir })
    fireEvent.click(screen.getByText('Salir'))
    expect(onSalir).toHaveBeenCalled()
  })

  it('el buscador navega a /productos con el texto buscado (mock del router)', () => {
    dibujar()
    fireEvent.change(screen.getByLabelText('Buscar productos'), { target: { value: 'falda' } })
    fireEvent.click(screen.getByText('Buscar'))
    expect(ultimaRuta()).toBe('/productos?q=falda')
  })

  it('el buscador vacío lleva al catálogo completo', () => {
    dibujar()
    fireEvent.click(screen.getByText('Buscar'))
    expect(ultimaRuta()).toBe('/productos')
  })
})
