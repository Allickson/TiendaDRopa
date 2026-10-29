import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { TiendaProvider } from '@/context/TiendaContext'

// Renderiza un componente dentro del contexto real de la tienda (con localStorage)
export function conTienda(ui: ReactElement) {
  return render(<TiendaProvider>{ui}</TiendaProvider>)
}

export const guardar = (clave: string, valor: unknown) => localStorage.setItem(clave, JSON.stringify(valor))
export const leer = <T = any>(clave: string): T => JSON.parse(localStorage.getItem(clave) as string)
