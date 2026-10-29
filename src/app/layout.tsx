import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '@/estilos/style.css'
import { TiendaProvider } from '@/context/TiendaContext'
import BootstrapClient from '@/componentes/BootstrapClient'

export const metadata: Metadata = {
  title: 'Pinkie | Tienda de ropa',
  description: 'Ropa linda, cómoda y a buen precio.',
  icons: { icon: '/favicon.svg' }
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <TiendaProvider>{children}</TiendaProvider>
        <BootstrapClient />
      </body>
    </html>
  )
}
