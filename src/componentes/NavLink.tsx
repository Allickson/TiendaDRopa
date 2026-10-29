'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

interface Props {
  href: string
  children: ReactNode
  className?: string
  exacto?: boolean // true: solo activo en la ruta exacta (ej: "/" o "/admin")
}

// Enlace que marca la clase "active" cuando corresponde a la ruta actual
export default function NavLink({ href, children, className = 'nav-link', exacto = false }: Props) {
  const ruta = usePathname()
  const activo = exacto ? ruta === href : ruta === href || ruta.startsWith(`${href}/`)
  return (
    <Link href={href} className={`${className}${activo ? ' active' : ''}`} aria-current={activo ? 'page' : undefined}>
      {children}
    </Link>
  )
}
