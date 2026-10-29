import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import IniciarSesion from '../paginas/IniciarSesion'
import { ADMIN_INICIAL } from '../utils/usuarios'

describe('IniciarSesion', () => {
  function dibujar(onIngresar = () => {}) {
    render(
      <MemoryRouter>
        <IniciarSesion usuarios={[ADMIN_INICIAL]} onIngresar={onIngresar} />
      </MemoryRouter>
    )
  }

  it('muestra un error con credenciales incorrectas', () => {
    dibujar()
    fireEvent.change(screen.getByLabelText('Correo'), { target: { value: 'x@x.cl' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'mal' } })
    fireEvent.click(screen.getByText('Ingresar'))
    expect(screen.getByText('Correo o contraseña incorrectos')).toBeTruthy()
  })

  it('con credenciales correctas llama a onIngresar sin la contraseña (spy)', () => {
    const onIngresar = jasmine.createSpy('onIngresar')
    dibujar(onIngresar)
    fireEvent.change(screen.getByLabelText('Correo'), { target: { value: 'admin@pinkie.cl' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'admin123' } })
    fireEvent.click(screen.getByText('Ingresar'))
    expect(onIngresar).toHaveBeenCalledTimes(1)
    expect(onIngresar.calls.mostRecent().args[0].password).toBeUndefined()
  })
})