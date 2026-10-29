'use client'
import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { UsuarioPublico } from '@/tipos'

interface Props {
  sesion: Pick<UsuarioPublico, 'rol'> | null
  children: ReactNode
}

// Protege las rutas del admin: sin sesión de administrador redirige al login
export default function RutaAdmin({ sesion, children }: Props) {
  const router = useRouter()
  const permitido = sesion?.rol === 'admin'

  useEffect(() => {
    if (!permitido) router.replace('/iniciar-sesion')
  }, [permitido, router])

  return permitido ? <>{children}</> : null
}
