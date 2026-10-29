import { render, screen } from '@testing-library/react'
import RutaAdmin from '@/componentes/RutaAdmin'
import { configurarRuta, ultimaRuta } from './mocks/next-navigation'

describe('RutaAdmin (protección de rutas, mock del router)', () => {
  beforeEach(() => configurarRuta({ pathname: '/admin' }))

  it('sin sesión no muestra el contenido y redirige al login', () => {
    render(<RutaAdmin sesion={null}><p>Panel</p></RutaAdmin>)
    expect(screen.queryByText('Panel')).toBeNull()
    expect(ultimaRuta()).toBe('/iniciar-sesion')
  })

  it('con sesión de cliente también redirige', () => {
    render(<RutaAdmin sesion={{ rol: 'cliente' }}><p>Panel</p></RutaAdmin>)
    expect(screen.queryByText('Panel')).toBeNull()
    expect(ultimaRuta()).toBe('/iniciar-sesion')
  })

  it('con sesión de admin muestra el contenido y no redirige', () => {
    render(<RutaAdmin sesion={{ rol: 'admin' }}><p>Panel</p></RutaAdmin>)
    expect(screen.getByText('Panel')).toBeTruthy()
    expect(ultimaRuta()).toBeUndefined()
  })
})
