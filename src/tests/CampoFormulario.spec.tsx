import { render, screen, fireEvent } from '@testing-library/react'
import CampoFormulario from '@/componentes/CampoFormulario'

const campo = (label: string) => screen.getByLabelText(label) as HTMLInputElement

describe('CampoFormulario (props y renderizado condicional)', () => {
  it('asocia la etiqueta al input y muestra el valor recibido por props', () => {
    render(<CampoFormulario name="nombre" label="Nombre" value="Vero" onChange={() => {}} />)
    expect(campo('Nombre').value).toBe('Vero')
  })

  it('muestra el error y la clase is-invalid solo cuando recibe un error', () => {
    const { rerender } = render(<CampoFormulario name="correo" label="Correo" value="" onChange={() => {}} />)
    expect(campo('Correo').classList.contains('is-invalid')).toBeFalse()

    rerender(<CampoFormulario name="correo" label="Correo" value="" onChange={() => {}} error="Correo inválido" />)
    expect(campo('Correo').classList.contains('is-invalid')).toBeTrue()
    expect(screen.getByText('Correo inválido')).toBeTruthy()
  })

  it('en modo select dibuja una opción por elemento más la opción vacía', () => {
    render(<CampoFormulario name="rol" label="Rol" tipo="select" opciones={['cliente', 'admin']} value="" onChange={() => {}} />)
    expect(screen.getByLabelText('Rol').querySelectorAll('option').length).toBe(3)
  })

  it('llama a onChange cuando el usuario escribe (spy)', () => {
    const onChange = jasmine.createSpy('onChange')
    render(<CampoFormulario name="calle" label="Calle" tipo="textarea" value="" onChange={onChange} />)
    fireEvent.change(screen.getByLabelText('Calle'), { target: { value: 'Los Pinos 123' } })
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('marca el campo requerido con un asterisco', () => {
    const { container } = render(<CampoFormulario name="x" label="X" value="" onChange={() => {}} requerido />)
    expect(container.querySelector('label .text-danger')).not.toBeNull()
  })
})
