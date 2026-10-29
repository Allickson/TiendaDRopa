import { validarEmail, validarTelefono } from '../utils/validaciones'

describe('utils/validaciones', () => {
  it('rechaza un email sin @ con un mensaje de error', () => {
    expect(validarEmail('vero.gmail.com')).toContain('email válido')
  })

  it('acepta un email correcto (devuelve texto vacío)', () => {
    expect(validarEmail('vero@gmail.com')).toBe('')
  })

  it('rechaza un teléfono de 8 dígitos y acepta uno de 9', () => {
    expect(validarTelefono('12345678')).not.toBe('')
    expect(validarTelefono('987654321')).toBe('')
  })
})