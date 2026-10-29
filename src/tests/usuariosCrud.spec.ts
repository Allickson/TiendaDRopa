import { ADMIN_INICIAL, actualizarUsuario, eliminarUsuario, nombreCompleto, registrarUsuario } from '@/utils/usuarios'

describe('CRUD de usuarios', () => {
  const cliente = { run: '22222222-2', nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@x.cl', password: 'secreta', rol: 'cliente' }
  const usuarios = [ADMIN_INICIAL, cliente]

  it('rechaza un RUN repetido al registrar', () => {
    const r = registrarUsuario(usuarios, { ...cliente, correo: 'nuevo@x.cl' })
    expect(r.ok).toBeFalse()
  })

  it('registra con el rol indicado', () => {
    const r = registrarUsuario(usuarios, { run: '3', nombre: 'B', correo: 'b@x.cl', password: '123456' }, 'admin')
    expect(r.usuarios[2].rol).toBe('admin')
  })

  it('al actualizar con contraseña vacía mantiene la anterior', () => {
    const r = actualizarUsuario(usuarios, cliente.run, { nombre: 'Anita', correo: 'ana@x.cl', password: '' })
    const ana = r.usuarios.find(u => u.run === cliente.run)
    expect(ana.nombre).toBe('Anita')
    expect(ana.password).toBe('secreta')
  })

  it('no permite usar el correo de otra cuenta', () => {
    const r = actualizarUsuario(usuarios, cliente.run, { correo: 'ADMIN@pinkie.cl' })
    expect(r.ok).toBeFalse()
  })

  it('no permite quitarle el rol al único administrador', () => {
    const r = actualizarUsuario(usuarios, ADMIN_INICIAL.run, { correo: ADMIN_INICIAL.correo, rol: 'cliente' })
    expect(r.ok).toBeFalse()
  })

  it('no permite eliminar la propia cuenta ni al último admin', () => {
    expect(eliminarUsuario(usuarios, cliente.run, cliente.run).ok).toBeFalse()
    expect(eliminarUsuario(usuarios, ADMIN_INICIAL.run, cliente.run).ok).toBeFalse()
    const r = eliminarUsuario(usuarios, cliente.run, ADMIN_INICIAL.run)
    expect(r.usuarios.length).toBe(1)
  })

  it('nombreCompleto une nombre y apellidos', () => {
    expect(nombreCompleto(cliente)).toBe('Ana Pérez')
    expect(nombreCompleto({ nombre: 'Solo' })).toBe('Solo')
  })
})
