import type { Resultado, Rol, Usuario, UsuarioPublico } from '@/tipos'

export const ADMIN_INICIAL: Usuario = {
  run: '11111111-1',
  nombre: 'Admin',
  apellidos: 'Pinkie',
  correo: 'admin@pinkie.cl',
  password: 'admin123',
  rol: 'admin'
}

type ResultadoUsuarios = Resultado<{ usuarios: Usuario[] }>

const mismoCorreo = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

export function nombreCompleto(usuario: Pick<Usuario, 'nombre' | 'apellidos'>): string {
  return [usuario.nombre, usuario.apellidos].filter(Boolean).join(' ')
}

export function registrarUsuario(usuarios: Usuario[], nuevo: Omit<Usuario, 'rol'>, rol: Rol = 'cliente'): ResultadoUsuarios {
  if (usuarios.some(u => mismoCorreo(u.correo, nuevo.correo))) {
    return { ok: false, error: 'Ya existe una cuenta con ese correo' }
  }
  if (nuevo.run && usuarios.some(u => u.run === nuevo.run)) {
    return { ok: false, error: 'Ya existe una cuenta con ese RUN' }
  }
  return { ok: true, usuarios: [...usuarios, { ...nuevo, correo: nuevo.correo.trim(), rol }] }
}

export function autenticar(usuarios: Usuario[], correo: string, password: string): Usuario | null {
  return usuarios.find(u => mismoCorreo(u.correo, correo) && u.password === password) ?? null
}

export function datosPublicos(usuario: Usuario): UsuarioPublico {
  const { password: _omitida, ...resto } = usuario
  return resto
}

export function buscarUsuario(usuarios: Usuario[], run: string): Usuario | null {
  return usuarios.find(u => u.run === run) ?? null
}

// Si cambios.password viene vacío se mantiene la contraseña anterior
export function actualizarUsuario(usuarios: Usuario[], run: string, cambios: Partial<Usuario>): ResultadoUsuarios {
  if (usuarios.some(u => u.run !== run && mismoCorreo(u.correo, cambios.correo ?? ''))) {
    return { ok: false, error: 'Ya existe otra cuenta con ese correo' }
  }
  const actual = buscarUsuario(usuarios, run)
  const admins = usuarios.filter(u => u.rol === 'admin').length
  if (actual?.rol === 'admin' && cambios.rol && cambios.rol !== 'admin' && admins === 1) {
    return { ok: false, error: 'Debe quedar al menos un administrador' }
  }
  const nuevos = usuarios.map(u => {
    if (u.run !== run) return u
    const { password, ...resto } = cambios
    return { ...u, ...resto, ...(password ? { password } : {}) }
  })
  return { ok: true, usuarios: nuevos }
}

export function eliminarUsuario(usuarios: Usuario[], run: string, runSesion?: string): ResultadoUsuarios {
  if (run === runSesion) return { ok: false, error: 'No puedes eliminar tu propia cuenta' }
  const usuario = buscarUsuario(usuarios, run)
  const admins = usuarios.filter(u => u.rol === 'admin').length
  if (usuario?.rol === 'admin' && admins === 1) {
    return { ok: false, error: 'Debe quedar al menos un administrador' }
  }
  return { ok: true, usuarios: usuarios.filter(u => u.run !== run) }
}
