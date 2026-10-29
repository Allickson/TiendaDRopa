export function validarNombre(nombre) {
  const valor = nombre.trim()
  if (valor.length < 3 || !isNaN(valor)) {
    return 'Ingrese un nombre válido (ej: Veronica Aguilar)'
  }
  return ''
}

export function validarEmail(email) {
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/.test(email.trim())) {
    return 'Ingrese un email válido (ej: vero@gmail.com)'
  }
  return ''
}

export function validarTelefono(telefono) {
  if (!/^[0-9]{9}$/.test(telefono.trim())) {
    return 'Ingrese un teléfono válido de 9 dígitos (ej: 912345678)'
  }
  return ''
}

export function validarComuna(comuna) {
  const valor = comuna.trim()
  if (valor.length < 3 || !isNaN(valor)) {
    return 'Ingrese una comuna válida (ej: Maipú)'
  }
  return ''
}

export function validarRun(run) {
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

export function validarPassword(password) {
  return password.length < 6 ? 'La contraseña debe tener al menos 6 caracteres' : ''
}

export function validarConfirmacion(password, confirmacion) {
  return password === confirmacion ? '' : 'Las contraseñas no coinciden'
}

export function validarDireccion(direccion) {
  return direccion.trim().length < 5 ? 'Ingrese una dirección válida (ej: Av. Los Pinos 123)' : ''
}