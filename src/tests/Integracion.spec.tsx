import { screen, fireEvent, render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { conTienda, guardar, leer } from './utilidades'
import { sesionAdmin } from './fixtures'
import { configurarRuta, ultimaRuta } from './mocks/next-navigation'
import { useTienda } from '@/context/TiendaContext'
import type { Orden, Producto, Usuario } from '@/tipos'
// Rutas reales del App Router
import TiendaLayoutRuta from '@/app/(tienda)/layout'
import PaginaInicio from '@/app/(tienda)/page'
import PaginaProductos from '@/app/(tienda)/productos/page'
import PaginaProducto from '@/app/(tienda)/producto/[id]/page'
import PaginaCategoria from '@/app/(tienda)/categorias/[nombre]/page'
import PaginaCategorias from '@/app/(tienda)/categorias/page'
import PaginaOfertas from '@/app/(tienda)/ofertas/page'
import PaginaCarrito from '@/app/(tienda)/carrito/page'
import PaginaComprar from '@/app/(tienda)/comprar/page'
import PaginaCompraOk from '@/app/(tienda)/comprar/ok/[numero]/page'
import PaginaCompraError from '@/app/(tienda)/comprar/error/[numero]/page'
import PaginaLogin from '@/app/(tienda)/iniciar-sesion/page'
import PaginaRegistro from '@/app/(tienda)/crear-cuenta/page'
import PaginaNosotros from '@/app/(tienda)/nosotros/page'
import PaginaBlog from '@/app/(tienda)/blog/page'
import PaginaBlogDetalle from '@/app/(tienda)/blog/[id]/page'
import PaginaContacto from '@/app/(tienda)/contacto/page'
import NotFound from '@/app/not-found'
import AdminLayoutRuta from '@/app/admin/layout'
import PaginaDashboard from '@/app/admin/page'
import PaginaOrdenes from '@/app/admin/ordenes/page'
import PaginaBoleta from '@/app/admin/ordenes/[numero]/page'
import PaginaAdminProductos from '@/app/admin/productos/page'
import PaginaNuevoProducto from '@/app/admin/productos/nuevo/page'
import PaginaEditarProducto from '@/app/admin/productos/[id]/editar/page'
import PaginaCriticos from '@/app/admin/productos/criticos/page'
import PaginaAdminCategorias from '@/app/admin/categorias/page'
import PaginaUsuarios from '@/app/admin/usuarios/page'
import PaginaNuevoUsuario from '@/app/admin/usuarios/nuevo/page'
import PaginaUsuario from '@/app/admin/usuarios/[run]/page'
import PaginaEditarUsuario from '@/app/admin/usuarios/[run]/editar/page'
import PaginaReportes from '@/app/admin/reportes/page'
import PaginaPerfil from '@/app/admin/perfil/page'

const escribir = (label: string | RegExp, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } })

function pagarConDatos() {
  escribir(/^Nombre/, 'Pedro')
  escribir(/^Apellidos/, 'Soto')
  escribir(/^Correo/, 'pedro@x.cl')
  escribir(/^Calle/, 'Los Crisantemos 123')
  escribir(/^Región/, 'Región Metropolitana de Santiago')
  escribir(/^Comuna/, 'Cerrillos')
  fireEvent.click(screen.getByText(/Pagar ahora/))
}

// Pruebas de integración: rutas del App Router + contexto real + localStorage.
// Se limpia localStorage para que cada prueba parta desde los datos iniciales.
describe('Integración (rutas de Next + TiendaContext)', () => {
  beforeEach(() => { localStorage.clear(); configurarRuta() })
  afterEach(() => localStorage.clear())

  it('useTienda fuera del proveedor lanza un error claro', () => {
    function SinProveedor() { useTienda(); return null }
    spyOn(console, 'error') // React registra el error lanzado; se silencia en la salida
    expect(() => render(<SinProveedor />)).toThrowError(/TiendaProvider/)
  })

  it('el layout de la tienda muestra navbar, contenido y footer', () => {
    conTienda(<TiendaLayoutRuta><PaginaInicio /></TiendaLayoutRuta>)
    expect(screen.getByRole('navigation')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Categorías' })).toBeTruthy()
    expect(screen.getByText(/Todos los derechos reservados/)).toBeTruthy()
  })

  it('las páginas públicas renderizan con los datos del contexto', () => {
    const paginas = [PaginaCategorias, PaginaOfertas, PaginaNosotros, PaginaBlog, PaginaContacto, PaginaLogin, PaginaRegistro]
    paginas.forEach(Pagina => {
      const { unmount, container } = conTienda(<Pagina />)
      expect(container.querySelector('h1')).not.toBeNull()
      unmount()
    })
  })

  it('el detalle de blog y la categoría leen el parámetro de la URL', () => {
    configurarRuta({ params: { id: '1', nombre: 'Inferior' } })
    const blog = conTienda(<PaginaBlogDetalle />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('rosa')
    blog.unmount()
    conTienda(<PaginaCategoria />)
    expect(screen.getByRole('heading', { name: 'Falda' })).toBeTruthy()
  })

  it('agregar desde el catálogo actualiza el carrito y lo persiste', () => {
    conTienda(<TiendaLayoutRuta><PaginaProductos /></TiendaLayoutRuta>)
    fireEvent.click(screen.getAllByText('Agregar')[0])
    expect(screen.getByRole('link', { name: /Carrito 1 / })).toBeTruthy()
    expect(leer('pinkie_carrito').length).toBe(1)
  })

  it('compra completa: agrega, paga, guarda la orden, descuenta stock y vacía el carrito', () => {
    configurarRuta({ params: { id: '2' } })
    const producto = conTienda(<PaginaProducto />)
    fireEvent.click(screen.getByText('Agregar al carrito'))
    producto.unmount()

    const carrito = conTienda(<PaginaCarrito />)
    fireEvent.click(screen.getByLabelText('Agregar una unidad de Pantalón'))
    carrito.unmount()

    const comprar = conTienda(<PaginaComprar />)
    pagarConDatos()
    expect(ultimaRuta()).toMatch(/^\/comprar\/ok\/\d+$/)
    comprar.unmount()

    expect(leer<Orden[]>('pinkie_ordenes')[0].estado).toBe('pagada')
    expect(leer<Producto[]>('pinkie_productos').find(p => p.id === 2)!.stock).toBe(13)
    expect(leer('pinkie_carrito')).toEqual([])

    configurarRuta({ params: { numero: ultimaRuta().split('/').pop()! } })
    conTienda(<PaginaCompraOk />)
    expect(screen.getByText(/Se ha realizado la compra/)).toBeTruthy()
  })

  it('pago rechazado: guarda la orden rechazada y ajusta el carrito al stock real', () => {
    guardar('pinkie_carrito', [{ id: 5, nombre: 'Suéter', precio: 14990, imagen: '/img/sueter.png', cantidad: 10, stock: 10 }])
    const comprar = conTienda(<PaginaComprar />)
    pagarConDatos()
    expect(ultimaRuta()).toMatch(/^\/comprar\/error\//)
    comprar.unmount()

    expect(leer<Orden[]>('pinkie_ordenes')[0].estado).toBe('rechazada')
    expect(leer('pinkie_carrito')[0].cantidad).toBe(4)
    expect(leer<Producto[]>('pinkie_productos').find(p => p.id === 5)!.stock).toBe(4)

    configurarRuta({ params: { numero: ultimaRuta().split('/').pop()! } })
    conTienda(<PaginaCompraError />)
    expect(screen.getByText(/No se pudo realizar el pago/)).toBeTruthy()
  })

  it('carrito: quitar, eliminar y vaciar actualizan el estado', () => {
    guardar('pinkie_carrito', [
      { id: 1, nombre: 'Polera', precio: 5990, imagen: '/img/polera.png', cantidad: 2, stock: 20 },
      { id: 4, nombre: 'Falda', precio: 6990, imagen: '/img/falda.png', cantidad: 1, stock: 18 }
    ])
    conTienda(<PaginaCarrito />)
    fireEvent.click(screen.getByLabelText('Quitar una unidad de Polera'))
    expect(leer('pinkie_carrito')[0].cantidad).toBe(1)
    fireEvent.click(screen.getAllByText('Eliminar')[1])
    expect(leer('pinkie_carrito').length).toBe(1)
    fireEvent.click(screen.getByText('Vaciar carrito'))
    expect(screen.getByText('El carrito está vacío.')).toBeTruthy()
  })

  it('registro e inicio de sesión de un cliente nuevo', () => {
    const registro = conTienda(<PaginaRegistro />)
    escribir(/^RUN/, '12345678-5')
    escribir(/^Nombre/, 'Veronica')
    escribir(/^Apellidos/, 'Aguilar')
    escribir(/^Correo/, 'vero@gmail.com')
    escribir(/^Contraseña/, 'secreta')
    escribir(/^Repetir/, 'secreta')
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    expect(leer<Usuario[]>('pinkie_usuarios').length).toBe(2)
    registro.unmount()

    conTienda(<PaginaLogin />)
    escribir('Correo', 'vero@gmail.com')
    escribir('Contraseña', 'secreta')
    fireEvent.click(screen.getByText('Ingresar'))
    expect(leer('pinkie_sesion').nombre).toBe('Veronica')
    expect(leer('pinkie_sesion').password).toBeUndefined()
  })

  it('cerrar sesión desde el navbar borra la sesión', () => {
    guardar('pinkie_sesion', { ...sesionAdmin, rol: 'cliente' })
    conTienda(<TiendaLayoutRuta><p>contenido</p></TiendaLayoutRuta>)
    fireEvent.click(screen.getByText('Salir'))
    expect(leer('pinkie_sesion')).toBeNull()
  })

  it('la página 404 incluye la navegación de la tienda', () => {
    conTienda(<NotFound />)
    expect(screen.getByText('Página no encontrada')).toBeTruthy()
    expect(screen.getByRole('navigation')).toBeTruthy()
  })

  describe('panel de administración', () => {
    it('sin sesión el layout admin redirige al login y no muestra nada', () => {
      const { container } = conTienda(<AdminLayoutRuta><PaginaDashboard /></AdminLayoutRuta>)
      expect(container.textContent).toBe('')
      expect(ultimaRuta()).toBe('/iniciar-sesion')
    })

    describe('con sesión de administrador', () => {
      beforeEach(() => guardar('pinkie_sesion', sesionAdmin))
      const conAdmin = (pagina: () => ReactElement) => conTienda(<AdminLayoutRuta>{pagina()}</AdminLayoutRuta>)

      it('muestra el dashboard con el menú lateral', () => {
        configurarRuta({ pathname: '/admin' })
        conAdmin(() => <PaginaDashboard />)
        expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeTruthy()
        expect(screen.getByRole('navigation', { name: 'Menú de administración' })).toBeTruthy()
      })

      it('las páginas del panel renderizan con los datos del contexto', () => {
        guardar('pinkie_ordenes', [{
          numero: 20260001, codigo: 'ORDER60001', fecha: new Date().toISOString(), estado: 'pagada', total: 5990,
          cliente: { nombre: 'Ana', apellidos: 'Pérez', correo: 'admin@pinkie.cl', calle: 'Calle 1', departamento: '', region: 'R', comuna: 'C', indicaciones: '' },
          items: [{ id: 1, nombre: 'Polera', precio: 5990, cantidad: 1, imagen: '/img/polera.png' }]
        }])
        configurarRuta({ params: { numero: '20260001', run: '11111111-1' } })
        const paginas = [PaginaOrdenes, PaginaBoleta, PaginaAdminProductos, PaginaCriticos, PaginaUsuarios, PaginaUsuario, PaginaReportes]
        paginas.forEach(Pagina => {
          const { unmount } = conAdmin(() => <Pagina />)
          expect(screen.getAllByRole('heading', { level: 1 }).length).toBe(1)
          unmount()
        })
      })

      it('crea y edita un producto; eliminar pide confirmación', () => {
        spyOn(window, 'confirm').and.returnValue(true)
        const nuevo = conAdmin(() => <PaginaNuevoProducto />)
        escribir(/^Nombre/, 'Abrigo')
        escribir(/^Precio \*/, '29990')
        escribir(/^Stock/, '3')
        fireEvent.click(screen.getByText('Agregar producto'))
        expect(leer<Producto[]>('pinkie_productos').length).toBe(7)
        nuevo.unmount()

        configurarRuta({ params: { id: '7' } })
        const editar = conAdmin(() => <PaginaEditarProducto />)
        escribir(/^Nombre/, 'Abrigo largo')
        fireEvent.click(screen.getByText('Guardar cambios'))
        expect(leer<Producto[]>('pinkie_productos')[6].nombre).toBe('Abrigo largo')
        editar.unmount()

        conAdmin(() => <PaginaAdminProductos />)
        fireEvent.click(screen.getAllByText('Eliminar')[6])
        expect(leer<Producto[]>('pinkie_productos').length).toBe(6)
      })

      it('renombra una categoría y sus productos, y no deja eliminarla si tiene productos', () => {
        conAdmin(() => <PaginaAdminCategorias />)
        fireEvent.click(screen.getAllByText('Editar')[1])
        escribir('Nuevo nombre para Inferior', 'Bottoms')
        fireEvent.click(screen.getByText('Guardar'))
        expect(leer('pinkie_categorias')).toEqual(['Superior', 'Bottoms'])
        expect(leer<Producto[]>('pinkie_productos').find(p => p.id === 2)!.categoria).toBe('Bottoms')

        fireEvent.click(screen.getAllByText('Eliminar')[0])
        expect(screen.getByRole('alert').textContent).toContain('hay productos')

        escribir('Nueva categoría', 'Accesorios')
        fireEvent.click(screen.getByText('Agregar categoría'))
        fireEvent.click(screen.getAllByText('Eliminar')[2])
        expect(leer('pinkie_categorias')).toEqual(['Superior', 'Bottoms'])
      })

      it('crea un usuario, lo edita y lo elimina', () => {
        spyOn(window, 'confirm').and.returnValue(true)
        const nuevo = conAdmin(() => <PaginaNuevoUsuario />)
        escribir(/^RUN/, '12345678-5')
        escribir(/^Nombre/, 'Carla')
        escribir(/^Apellidos/, 'Rojas')
        escribir(/^Correo/, 'carla@x.cl')
        escribir(/^Contraseña/, 'secreta')
        fireEvent.click(screen.getByText('Crear usuario'))
        expect(leer<Usuario[]>('pinkie_usuarios').length).toBe(2)
        nuevo.unmount()

        configurarRuta({ params: { run: '12345678-5' } })
        const editar = conAdmin(() => <PaginaEditarUsuario />)
        escribir(/^Nombre/, 'Carlita')
        fireEvent.click(screen.getByText('Guardar cambios'))
        expect(leer<Usuario[]>('pinkie_usuarios')[1].nombre).toBe('Carlita')
        editar.unmount()

        conAdmin(() => <PaginaUsuarios />)
        fireEvent.click(screen.getAllByText('Eliminar')[0])
        expect(screen.getByRole('alert').textContent).toContain('propia cuenta')
        fireEvent.click(screen.getAllByText('Eliminar')[1])
        expect(leer<Usuario[]>('pinkie_usuarios').length).toBe(1)
      })

      it('actualiza su perfil y la sesión sin perder la contraseña', () => {
        conAdmin(() => <PaginaPerfil />)
        escribir(/^Nombre/, 'Administradora')
        fireEvent.click(screen.getByText('Guardar cambios'))
        expect(leer('pinkie_sesion').nombre).toBe('Administradora')
        expect(leer<Usuario[]>('pinkie_usuarios')[0].password).toBe('admin123')
      })

      it('cerrar sesión desde el panel borra la sesión y redirige', () => {
        conAdmin(() => <PaginaDashboard />)
        fireEvent.click(screen.getByText('Cerrar sesión'))
        expect(leer('pinkie_sesion')).toBeNull()
        expect(ultimaRuta()).toBe('/iniciar-sesion')
      })
    })
  })
})
