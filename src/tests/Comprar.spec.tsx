import { render, screen, fireEvent } from '@testing-library/react'
import Comprar from '@/paginas/Comprar'
import type { ItemCarrito } from '@/tipos'
import { configurarRuta, ultimaRuta } from './mocks/next-navigation'

describe('Comprar / checkout (estado, validación y mocks)', () => {
  const carrito: ItemCarrito[] = [{ id: 1, nombre: 'Polera', precio: 5990, cantidad: 2, imagen: '/img/polera.png' }]
  type Props = Partial<Parameters<typeof Comprar>[0]>

  beforeEach(() => configurarRuta({ pathname: '/comprar' }))

  function dibujar(props: Props = {}) {
    const onPagar = props.onPagar ?? jasmine.createSpy('onPagar')
    const resultado = render(<Comprar carrito={carrito} sesion={null} {...props} onPagar={onPagar} />)
    return { onPagar, ...resultado }
  }

  const control = (label: RegExp) => screen.getByLabelText(label) as HTMLInputElement & HTMLSelectElement
  const escribir = (label: RegExp, value: string) => fireEvent.change(control(label), { target: { value } })

  function completar() {
    escribir(/^Nombre/, 'Pedro')
    escribir(/^Apellidos/, 'Soto')
    escribir(/^Correo/, 'pedro@x.cl')
    escribir(/^Calle/, 'Los Crisantemos 123')
    escribir(/^Región/, 'Región Metropolitana de Santiago')
    escribir(/^Comuna/, 'Cerrillos')
  }

  it('el estado del formulario cambia cuando el usuario escribe', () => {
    dibujar()
    escribir(/^Nombre/, 'Pedro')
    expect(control(/^Nombre/).value).toBe('Pedro')
  })

  it('la comuna se habilita al elegir región y muestra solo sus comunas', () => {
    dibujar()
    expect(control(/^Comuna/).disabled).toBeTrue()
    escribir(/^Región/, 'Región de Valparaíso')
    expect(control(/^Comuna/).disabled).toBeFalse()
    expect(Array.from(control(/^Comuna/).options).map(o => o.value)).toContain('Viña del Mar')
  })

  it('al cambiar de región se reinicia la comuna elegida', () => {
    dibujar()
    escribir(/^Región/, 'Región Metropolitana de Santiago')
    escribir(/^Comuna/, 'Maipú')
    escribir(/^Región/, 'Región del Biobío')
    expect(control(/^Comuna/).value).toBe('')
  })

  it('con campos vacíos muestra errores y no llama a onPagar', () => {
    const { onPagar, container } = dibujar()
    fireEvent.click(screen.getByText(/Pagar ahora/))
    expect(container.querySelectorAll('.is-invalid').length).toBe(6)
    expect(onPagar).not.toHaveBeenCalled()
  })

  it('con datos válidos llama a onPagar y navega a la página de éxito (mock)', () => {
    const onPagar = jasmine.createSpy('onPagar').and.returnValue({ numero: 20260001, estado: 'pagada' })
    dibujar({ onPagar })
    completar()
    fireEvent.click(screen.getByText(/Pagar ahora/))
    expect(onPagar).toHaveBeenCalledTimes(1)
    expect(onPagar.calls.mostRecent().args[0].comuna).toBe('Cerrillos')
    expect(ultimaRuta()).toBe('/comprar/ok/20260001')
  })

  it('si el pago es rechazado navega a la página de error (mock)', () => {
    const onPagar = jasmine.createSpy('onPagar').and.returnValue({ numero: 20260002, estado: 'rechazada' })
    dibujar({ onPagar })
    completar()
    fireEvent.click(screen.getByText(/Pagar ahora/))
    expect(ultimaRuta()).toBe('/comprar/error/20260002')
  })

  it('autocompleta los datos si hay sesión iniciada', () => {
    dibujar({ sesion: { nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@x.cl' } })
    expect(control(/^Correo/).value).toBe('ana@x.cl')
    expect(control(/^Apellidos/).value).toBe('Pérez')
  })

  it('con el carrito vacío no muestra el formulario', () => {
    dibujar({ carrito: [] })
    expect(screen.getByText('Tu carrito está vacío.')).toBeTruthy()
    expect(screen.queryByText(/Pagar ahora/)).toBeNull()
  })
})
