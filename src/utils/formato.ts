export function formatoPrecio(valor: number): string {
  return `$${Number(valor).toLocaleString('es-CL')}`
}

export function formatoFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CL')
}
