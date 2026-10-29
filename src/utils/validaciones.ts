// Cada validador devuelve '' si el valor es válido, o el mensaje de error.

export function validarNombre(nombre: string): string {
  const valor = nombre.trim()
  return valor.length < 3 || !isNaN(Number(valor)) ? 'Ingrese un nombre válido (ej: Veronica Aguilar)' : ''
}

export function validarApellidos(apellidos: string): string {
  const valor = apellidos.trim()
  return valor.length < 2 || !isNaN(Number(valor)) ? 'Ingrese apellidos válidos (ej: Aguilar Soto)' : ''
}

export function validarEmail(email: string): string {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/.test(email.trim()) ? '' : 'Ingrese un email válido (ej: vero@gmail.com)'
}

export function validarTelefono(telefono: string): string {
  return /^[0-9]{9}$/.test(telefono.trim()) ? '' : 'Ingrese un teléfono válido de 9 dígitos (ej: 912345678)'
}

export function validarComuna(comuna: string): string {
  const valor = comuna.trim()
  return valor.length < 3 || !isNaN(Number(valor)) ? 'Ingrese una comuna válida (ej: Maipú)' : ''
}

export function validarRun(run: string): string {
  const limpio = run.replace(/[.\-\s]/g, '').toUpperCase()
  if (!/^\d{7,8}[0-9K]$/.test(limpio)) return 'Ingrese un RUN válido (ej: 11111111-1)'
  const cuerpo = limpio.slice(0, -1)
  const dv = limpio.slice(-1)
  let suma = 0
  let multiplicador = 2
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
  }
  const resto = 11 - (suma % 11)
  const esperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto)
  return dv === esperado ? '' : 'El RUN no es válido'
}

export function validarPassword(password: string): string {
  return password.length < 6 ? 'La contraseña debe tener al menos 6 caracteres' : ''
}

export function validarConfirmacion(password: string, confirmacion: string): string {
  return password === confirmacion ? '' : 'Las contraseñas no coinciden'
}

export function validarDireccion(direccion: string): string {
  return direccion.trim().length < 5 ? 'Ingrese una dirección válida (ej: Av. Los Pinos 123)' : ''
}

export function validarSeleccion(valor: string, campo: string): string {
  return valor ? '' : `Seleccione una ${campo}`
}

// ---- Validación de formularios completos ----

export interface Regla<T> {
  name: keyof T & string
  validar: (valor: string, todos: T) => string
}

export type Errores<T> = Partial<Record<keyof T, string>>

export function validarFormulario<T extends object>(reglas: Regla<T>[], valores: T): Errores<T> {
  const errores: Errores<T> = {}
  reglas.forEach(r => { errores[r.name] = r.validar(String(valores[r.name] ?? ''), valores) })
  return errores
}

export function hayErrores(errores: Record<string, string | undefined>): boolean {
  return Object.values(errores).some(m => Boolean(m))
}
