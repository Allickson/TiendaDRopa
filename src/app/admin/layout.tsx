'use client'
import type { ReactNode } from 'react'
import RutaAdmin from '@/componentes/RutaAdmin'
import AdminLayout from '@/paginas/admin/AdminLayout'
import { useTienda } from '@/context/TiendaContext'

// Todas las rutas /admin/* pasan por aquí: protección por rol + menú lateral
export default function Layout({ children }: { children: ReactNode }) {
  const { sesion, cerrarSesion } = useTienda()
  return (
    <RutaAdmin sesion={sesion}>
      <AdminLayout nombre={sesion?.nombre ?? ''} onSalir={cerrarSesion}>{children}</AdminLayout>
    </RutaAdmin>
  )
}
