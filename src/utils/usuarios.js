export const ADMIN_INICIAL = {
  run: '11111111-1',
  nombre: 'Admin Pinkie',
  correo: 'admin@pinkie.cl',
  password: 'admin123',
  rol: 'admin'
}

export function registrarUsuario(usuarios, nuevo) {
  const existe = usuarios.some(u => u.correo.toLowerCase() === nuevo.correo.trim().toLowerCase())
  if (existe) return { ok: false, error: 'Ya existe una cuenta con ese correo' }
  const usuario = { ...nuevo, correo: nuevo.correo.trim(), rol: 'cliente' }
  return { ok: true, usuarios: [...usuarios, usuario] }
}

export function autenticar(usuarios, correo, password) {
  return (
    usuarios.find(
      u => u.correo.toLowerCase() === correo.trim().toLowerCase() && u.password === password
    ) || null
  )
}

export function datosPublicos(usuario) {
  return { run: usuario.run, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol }
}