import { render, screen, fireEvent } from '@testing-library/react'
import Contacto from '@/paginas/Contacto'

describe('Contacto', () => {
  it('con los campos vacíos muestra un error bajo cada campo', () => {
    const { container } = render(<Contacto />)
    fireEvent.click(screen.getByText('Enviar'))
    const errores = container.querySelectorAll('.invalid-feedback')
    const conTexto = Array.from(errores).filter(e => e.textContent !== '')
    expect(conTexto.length).toBe(4)
  })

  it('con datos válidos muestra el mensaje de éxito', () => {
    render(<Contacto />)
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Veronica Aguilar' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'vero@gmail.com' } })
    fireEvent.change(screen.getByLabelText('Teléfono'), { target: { value: '987654321' } })
    fireEvent.change(screen.getByLabelText('Comuna'), { target: { value: 'Maipú' } })
    fireEvent.click(screen.getByText('Enviar'))
    expect(screen.getByText(/Recibimos tus datos/)).toBeTruthy()
  })
})