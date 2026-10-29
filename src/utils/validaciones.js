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