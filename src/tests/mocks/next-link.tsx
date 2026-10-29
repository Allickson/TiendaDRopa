import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { routerMock } from './next-navigation'

// Mock de 'next/link': un <a> que en vez de recargar la página registra la navegación en routerMock
interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: ReactNode
}

export default function Link({ href, children, onClick, ...resto }: Props) {
  function navegar(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    onClick?.(e)
    routerMock.push(href)
  }
  return <a href={href} onClick={navegar} {...resto}>{children}</a>
}
