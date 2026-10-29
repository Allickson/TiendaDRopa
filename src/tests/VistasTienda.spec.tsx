import { render, screen, fireEvent } from '@testing-library/react'
import Home from '@/paginas/Home'
import Productos from '@/paginas/Productos'
import Categorias from '@/paginas/Categorias'
import Blog from '@/paginas/Blog'
import BlogDetalle from '@/paginas/BlogDetalle'
import CompraOk from '@/paginas/CompraOk'
import CompraError from '@/paginas/CompraError'
import DetalleProducto from '@/paginas/DetalleProducto'
import CrearCuenta from '@/paginas/CrearCuenta'
import Ofertas from '@/paginas/Ofertas'
import Nosotros from '@/paginas/Nosotros'
import NoEncontrado from '@/paginas/NoEncontrado'
import { productos, categorias } from '@/data/productos'
import { entradas } from '@/data/blog'
import { ordenPagada, ordenRechazada } from './fixtures'
import { configurarRuta, ultimaRuta } from './mocks/next-navigation'

const catalogo = { productos, categorias, onAgregar: () => {} }
// Las tarjetas de producto van en columnas col-lg-3 (las de categoría no)
const tarjetas = (c: HTMLElement) => c.querySelectorAll('.col-lg-3 .card-producto').length
const escribir = (label: string | RegExp, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } })

describe('Vistas de la tienda', () => {
  beforeEach(() => configurarRuta())

  it('Home muestra las categorías y solo los productos en oferta', () => {
    const { container } = render(<Home {...catalogo} />)
    expect(screen.getByRole('heading', { name: 'Superior' })).toBeTruthy()
    expect(tarjetas(container)).toBe(2)
  })

  describe('Productos', () => {
    it('lee la búsqueda inicial desde la URL (?q=)', () => {
      configurarRuta({ pathname: '/productos', search: 'q=fal' })
      const { container } = render(<Productos {...catalogo} />)
      expect(tarjetas(container)).toBe(1)
      expect(screen.getByText('1 resultado')).toBeTruthy()
    })

    it('al cambiar la categoría filtra y actualiza la URL', () => {
      const { container } = render(<Productos {...catalogo} />)
      escribir('Categoría', 'Inferior')
      expect(tarjetas(container)).toBe(2)
      expect(ultimaRuta()).toBe('/productos?categoria=Inferior')
    })

    it('al escribir en el buscador actualiza los resultados', () => {
      render(<Productos {...catalogo} />)
      escribir('Buscar prenda', 'zzz')
      expect(screen.getByText('No encontramos prendas con ese filtro.')).toBeTruthy()
      expect(ultimaRuta()).toBe('/productos?q=zzz')
    })

    it('volver a "Todas" deja la URL limpia', () => {
      configurarRuta({ search: 'categoria=Inferior' })
      render(<Productos {...catalogo} />)
      escribir('Categoría', 'Todas')
      expect(ultimaRuta()).toBe('/productos')
    })
  })

  describe('Categorías', () => {
    it('sin categoría seleccionada muestra solo las tarjetas de categoría', () => {
      render(<Categorias {...catalogo} />)
      expect(screen.getByRole('heading', { name: 'Superior' })).toBeTruthy()
      expect(screen.queryByRole('heading', { name: 'Polera' })).toBeNull()
    })

    it('con una categoría muestra sus productos', () => {
      configurarRuta({ params: { nombre: 'Inferior' } })
      render(<Categorias {...catalogo} />)
      expect(screen.getByRole('heading', { name: 'Falda' })).toBeTruthy()
      expect(screen.queryByRole('heading', { name: 'Polera' })).toBeNull()
    })

    it('decodifica nombres con caracteres especiales en la URL', () => {
      configurarRuta({ params: { nombre: encodeURIComponent('Ropa de baño') } })
      render(<Categorias productos={productos} categorias={['Ropa de baño']} onAgregar={() => {}} />)
      expect(screen.getByText('Esta categoría todavía no tiene productos.')).toBeTruthy()
    })

    it('avisa si la categoría no existe', () => {
      configurarRuta({ params: { nombre: 'Zapatos' } })
      render(<Categorias {...catalogo} />)
      expect(screen.getByRole('alert').textContent).toContain('no existe')
    })
  })

  describe('Blog', () => {
    it('lista todas las entradas con su enlace', () => {
      render(<Blog />)
      expect(screen.getAllByText('Leer más').length).toBe(entradas.length)
    })

    it('el detalle muestra el contenido del artículo', () => {
      configurarRuta({ params: { id: '2' } })
      render(<BlogDetalle />)
      expect(screen.getByRole('heading', { name: entradas[1].titulo })).toBeTruthy()
    })

    it('el detalle avisa si el artículo no existe', () => {
      configurarRuta({ params: { id: '99' } })
      render(<BlogDetalle />)
      expect(screen.getByText('Artículo no encontrado')).toBeTruthy()
    })
  })

  describe('Resultado de la compra', () => {
    it('compra exitosa muestra el número y el resumen', () => {
      configurarRuta({ params: { numero: '20260001' } })
      render(<CompraOk ordenes={[ordenPagada]} />)
      expect(screen.getByText(/Se ha realizado la compra n.º 20260001/)).toBeTruthy()
      expect(screen.getByText('Total pagado: $11.980')).toBeTruthy()
    })

    it('imprimir boleta llama a window.print (mock)', () => {
      const imprimir = spyOn(window, 'print')
      configurarRuta({ params: { numero: '20260001' } })
      render(<CompraOk ordenes={[ordenPagada]} />)
      fireEvent.click(screen.getByText('Imprimir boleta en PDF'))
      expect(imprimir).toHaveBeenCalled()
    })

    it('compra exitosa con un número inexistente muestra aviso', () => {
      configurarRuta({ params: { numero: '1' } })
      render(<CompraOk ordenes={[]} />)
      expect(screen.getByText('No encontramos esa compra')).toBeTruthy()
    })

    it('pago con error muestra el resumen y el botón para reintentar', () => {
      configurarRuta({ params: { numero: '20260002' } })
      render(<CompraError ordenes={[ordenRechazada]} />)
      expect(screen.getByText(/No se pudo realizar el pago n.º 20260002/)).toBeTruthy()
      expect(screen.getByText('Volver a realizar el pago').getAttribute('href')).toBe('/carrito')
    })

    it('pago con error sin orden conocida muestra solo el mensaje', () => {
      configurarRuta({ params: { numero: '5' } })
      const { container } = render(<CompraError ordenes={[]} />)
      expect(container.querySelector('table')).toBeNull()
    })
  })

  describe('Detalle de producto', () => {
    it('muestra precio de oferta y llama a onAgregar (spy)', () => {
      configurarRuta({ params: { id: '1' } })
      const onAgregar = jasmine.createSpy('onAgregar')
      render(<DetalleProducto productos={productos} onAgregar={onAgregar} />)
      expect(screen.getByText('$5.990')).toBeTruthy()
      fireEvent.click(screen.getByText('Agregar al carrito'))
      expect(onAgregar).toHaveBeenCalledWith(productos[0])
    })

    it('deshabilita el botón si el producto está agotado', () => {
      configurarRuta({ params: { id: '2' } })
      render(<DetalleProducto productos={[{ ...productos[1], stock: 0 }]} onAgregar={() => {}} />)
      expect((screen.getByText('Agregar al carrito') as HTMLButtonElement).disabled).toBeTrue()
      expect(screen.getByText('Producto agotado')).toBeTruthy()
    })

    it('avisa si el producto no existe', () => {
      configurarRuta({ params: { id: '999' } })
      render(<DetalleProducto productos={productos} onAgregar={() => {}} />)
      expect(screen.getByText('Producto no encontrado')).toBeTruthy()
    })
  })

  describe('Crear cuenta', () => {
    function completar(correo: string) {
      escribir(/^RUN/, '12345678-5')
      escribir(/^Nombre/, 'Veronica')
      escribir(/^Apellidos/, 'Aguilar')
      escribir(/^Correo/, correo)
      escribir(/^Contraseña/, 'secreta')
      escribir(/^Repetir/, 'secreta')
    }

    it('con datos válidos registra y lleva al login', () => {
      const onRegistrar = jasmine.createSpy('onRegistrar').and.returnValue({ ok: true })
      render(<CrearCuenta onRegistrar={onRegistrar} />)
      completar('vero@gmail.com')
      fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
      expect(onRegistrar.calls.mostRecent().args[0].confirmar).toBeUndefined()
      expect(ultimaRuta()).toBe('/iniciar-sesion')
    })

    it('si el registro falla muestra el error general (mock)', () => {
      const onRegistrar = jasmine.createSpy('onRegistrar').and.returnValue({ ok: false, error: 'Ya existe una cuenta con ese correo' })
      render(<CrearCuenta onRegistrar={onRegistrar} />)
      completar('admin@pinkie.cl')
      fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
      expect(screen.getByRole('alert').textContent).toContain('Ya existe')
      expect(ultimaRuta()).toBeUndefined()
    })

    it('con contraseñas distintas marca el error de confirmación', () => {
      const onRegistrar = jasmine.createSpy('onRegistrar')
      render(<CrearCuenta onRegistrar={onRegistrar} />)
      escribir(/^Contraseña/, 'secreta')
      escribir(/^Repetir/, 'otra')
      fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
      expect(screen.getByText('Las contraseñas no coinciden')).toBeTruthy()
      expect(onRegistrar).not.toHaveBeenCalled()
    })
  })

  it('Ofertas muestra solo los productos con precio de oferta', () => {
    const { container } = render(<Ofertas productos={productos} onAgregar={() => {}} />)
    expect(tarjetas(container)).toBe(productos.filter(p => p.precioOferta).length)
  })

  it('Nosotros muestra historia, misión y visión', () => {
    render(<Nosotros />)
    expect(screen.getAllByRole('heading', { level: 2 }).length).toBe(3)
  })

  it('NoEncontrado ofrece volver al inicio', () => {
    render(<NoEncontrado />)
    expect(screen.getByText('Ir al inicio').getAttribute('href')).toBe('/')
  })
})
