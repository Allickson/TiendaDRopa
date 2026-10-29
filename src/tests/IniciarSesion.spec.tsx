import { render, screen, fireEvent } from '@testing-library/react'
import IniciarSesion from '@/paginas/IniciarSesion'
import { ADMIN_INICIAL } from '@/utils/usuarios'
import { cliente } from './fixtures'
import { configurarRuta, ultimaRuta } from './mocks/next-navigation'

describe('IniciarSesion', () => {
  beforeEach(() => configurarRuta({ pathname: '/iniciar-sesion' }))

  function ingresar(correo: string, password: string, onIngresar = jasmine.createSpy('onIngresar')) {
    render(<IniciarSesion usuarios={[ADMIN_INICIAL, cliente]} onIngresar={onIngresar} />)
    fireEvent.change(screen.getByLabelText('Correo'), { target: { value: correo } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: password } })
    fireEvent.click(screen.getByText('Ingresar'))
    return onIngresar
  }

  it('muestra un error con credenciales incorrectas', () => {
    const onIngresar = ingresar('x@x.cl', 'mal')
    expect(screen.getByText('Correo o contraseña incorrectos')).toBeTruthy()
    expect(onIngresar).not.toHaveBeenCalled()
  })

  it('el admin entra sin enviar la contraseña a la sesión y va al panel (spy)', () => {
    const onIngresar = ingresar('admin@pinkie.cl', 'admin123')
    expect(onIngresar).toHaveBeenCalledTimes(1)
    expect(onIngresar.calls.mostRecent().args[0].password).toBeUndefined()
    expect(ultimaRuta()).toBe('/admin')
  })

  it('un cliente vuelve al inicio', () => {
    ingresar('ana@x.cl', 'secreta')
    expect(ultimaRuta()).toBe('/')
  })
})
