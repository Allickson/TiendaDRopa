import type { Region } from '@/tipos'

export const regiones: Region[] = [
  {
    nombre: 'Región Metropolitana de Santiago',
    comunas: ['Cerrillos', 'Estación Central', 'La Florida', 'Las Condes', 'Maipú', 'Ñuñoa', 'Providencia', 'Puente Alto', 'Santiago', 'San Bernardo']
  },
  { nombre: 'Región de Valparaíso', comunas: ['Quilpué', 'San Antonio', 'Valparaíso', 'Villa Alemana', 'Viña del Mar'] },
  { nombre: 'Región del Biobío', comunas: ['Chiguayante', 'Concepción', 'Los Ángeles', 'San Pedro de la Paz', 'Talcahuano'] },
  { nombre: 'Región de O’Higgins', comunas: ['Machalí', 'Rancagua', 'Rengo', 'San Fernando'] }
]

export function comunasDe(nombreRegion: string): string[] {
  return regiones.find(r => r.nombre === nombreRegion)?.comunas ?? []
}
