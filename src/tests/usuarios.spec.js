import { registrarUsuario, autenticar, datosPublicos, ADMIN_INICIAL } from '../utils/usuarios'
import { validarRun, validarPassword, validarConfirmacion } from '../utils/validaciones'

describe('usuarios', () => {
  it('registra un usuario nuevo con rol cliente', () => {
    const r = registrarUsuario([ADMIN_INICIAL], { run: '1', nombre: 'Ana', correo: 'ana@x.cl', password: '123456' })
    expect(r.ok).toBeTrue()
    expect(r.usuarios[1].rol).toBe('cliente')
  })

  it('rechaza un correo repetido sin distinguir mayúsculas', () => {
    const r = registrarUsuario([ADMIN_INICIAL], { run: '1', nombre: 'Ana', correo: 'ADMIN@pinkie.cl', password: '123456' })
    expect(r.ok).toBeFalse()
  })

  it('autentica con credenciales correctas y devuelve null con incorrectas', () => {
    expect(autenticar([ADMIN_INICIAL], 'admin@pinkie.cl', 'admin123').rol).toBe('admin')
    expect(autenticar([ADMIN_INICIAL], 'admin@pinkie.cl', 'mal')).toBeNull()
  })

  it('datosPublicos no incluye la contraseña', () => {
    expect(datosPublicos(ADMIN_INICIAL).password).toBeUndefined()
  })
})

describe('validaciones nuevas', () => {
  it('valida el dígito verificador del RUN', () => {
    expect(validarRun('11111111-1')).toBe('')
    expect(validarRun('11111111-K')).not.toBe('')
  })

  it('exige contraseña de 6 caracteres y que coincida', () => {
    expect(validarPassword('123')).not.toBe('')
    expect(validarConfirmacion('abc123', 'abc123')).toBe('')
    expect(validarConfirmacion('abc123', 'otra')).not.toBe('')
  })
})