'use client'
import type { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { useTienda } from '@/context/TiendaContext'

// Estructura común de las páginas públicas: barra, contenido y pie.
export default function TiendaLayout({ children }: { children: ReactNode }) {
  const { categorias, totalItems, totalPrecio, sesion, cerrarSesion } = useTienda()
  return (
    <>
      <Navbar categorias={categorias} totalItems={totalItems} totalPrecio={totalPrecio} sesion={sesion} onSalir={cerrarSesion} />
      <main className="flex-grow-1">{children}</main>
      <Footer />
    </>
  )
}
