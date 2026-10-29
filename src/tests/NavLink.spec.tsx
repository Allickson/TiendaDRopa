import { render, screen } from '@testing-library/react'
import NavLink from '@/componentes/NavLink'
import { configurarRuta } from './mocks/next-navigation'

describe('NavLink (clase active según la ruta, mock de usePathname)', () => {
  it('marca activo el enlace de la ruta actual y sus subrutas', () => {
    configurarRuta({ pathname: '/blog/2' })
    render(<NavLink href="/blog">Blog</NavLink>)
    expect(screen.getByText('Blog').classList.contains('active')).toBeTrue()
    expect(screen.getByText('Blog').getAttribute('aria-current')).toBe('page')
  })

  it('con exacto solo se activa en la ruta exacta', () => {
    configurarRuta({ pathname: '/admin/ordenes' })
    render(<NavLink href="/admin" exacto>Dashboard</NavLink>)
    expect(screen.getByText('Dashboard').classList.contains('active')).toBeFalse()
  })

  it('no marca activo un enlace de otra sección', () => {
    configurarRuta({ pathname: '/productos' })
    render(<NavLink href="/ofertas">Ofertas</NavLink>)
    expect(screen.getByText('Ofertas').classList.contains('active')).toBeFalse()
  })
})
