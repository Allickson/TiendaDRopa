import type { ReactNode } from 'react'
import TiendaLayout from '@/componentes/TiendaLayout'

// El grupo (tienda) no aparece en la URL: solo agrupa las páginas públicas bajo el mismo layout
export default function Layout({ children }: { children: ReactNode }) {
  return <TiendaLayout>{children}</TiendaLayout>
}
