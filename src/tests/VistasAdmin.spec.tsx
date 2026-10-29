import { render, screen, fireEvent } from '@testing-library/react'
import AdminDashboard from '@/paginas/admin/AdminDashboard'
import AdminOrdenes from '@/paginas/admin/AdminOrdenes'
import AdminBoleta from '@/paginas/admin/AdminBoleta'
import AdminProductos from '@/paginas/admin/AdminProductos'
import AdminCriticos from '@/paginas/admin/AdminCriticos'
import AdminUsuarios from '@/paginas/admin/AdminUsuarios'
import AdminUsuarioForm from '@/paginas/admin/AdminUsuarioForm'
import AdminUsuarioDetalle from '@/paginas/admin/AdminUsuarioDetalle'
import AdminReportes from '@/paginas/admin/AdminReportes'
import AdminPerfil from '@/paginas/admin/AdminPerfil'
import AdminLayout from '@/paginas/admin/AdminLayout'
import { productos, categorias } from '@/data/productos'
import { ADMIN_INICIAL } from '@/utils/usuarios'
import { ordenPagada, ordenRechazada, cliente, sesionAdmin } from './fixtures'
import { configurarRuta, ultimaRuta } from './mocks/next-navigation'

const escribir = (label: string | RegExp, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } })
const ordenes = [ordenPagada, ordenRechazada]
const usuarios = [ADMIN_INICIAL, cliente]
const filas = (c: HTMLElement) => c.querySelectorAll('tbody tr').length

describe('Vistas del administrador', () => {
  beforeEach(() => configurarRuta({ pathname: '/admin' }))

  it('el layout muestra el menú lateral con el nombre y el contenido', () => {
    const onSalir = jasmine.createSpy('onSalir')
    render(<AdminLayout nombre="Admin" onSalir={onSalir}><p>Contenido</p></AdminLayout>)
    expect(screen.getByText('Pinkie · Admin')).toBeTruthy()
    expect(screen.getByText('Contenido')).toBeTruthy()
    expect(screen.getByText('Dashboard').classList.contains('active')).toBeTrue()
    fireEvent.click(screen.getByText('Cerrar sesión'))
    expect(onSalir).toHaveBeenCalled()
  })

  it('el dashboard resume compras, productos y usuarios', () => {
    render(<AdminDashboard productos={productos} usuarios={usuarios} ordenes={ordenes} />)
    expect(screen.getByText('Ingresos: $11.980')).toBeTruthy()
    expect(screen.getByText('Productos con stock crítico: 1')).toBeTruthy()
  })

  describe('Órdenes y boletas', () => {
    it('lista todas las órdenes y filtra por estado', () => {
      const { container } = render(<AdminOrdenes ordenes={ordenes} />)
      expect(filas(container)).toBe(2)
      escribir('Filtrar por estado', 'rechazada')
      expect(filas(container)).toBe(1)
    })

    it('sin órdenes muestra el aviso', () => {
      render(<AdminOrdenes ordenes={[]} />)
      expect(screen.getByRole('status')).toBeTruthy()
    })

    it('la boleta muestra el detalle e imprime (mock de window.print)', () => {
      const imprimir = spyOn(window, 'print')
      configurarRuta({ params: { numero: '20260001' } })
      render(<AdminBoleta ordenes={ordenes} />)
      expect(screen.getByRole('heading', { name: /Boleta n.º 20260001/ })).toBeTruthy()
      fireEvent.click(screen.getByText('Imprimir boleta'))
      expect(imprimir).toHaveBeenCalled()
    })

    it('la boleta avisa si la orden no existe', () => {
      configurarRuta({ params: { numero: '5' } })
      render(<AdminBoleta ordenes={ordenes} />)
      expect(screen.getByText('Orden no encontrada')).toBeTruthy()
    })
  })

  describe('Productos', () => {
    it('busca productos por nombre', () => {
      const { container } = render(<AdminProductos productos={productos} onEliminar={() => {}} />)
      escribir('Buscar producto', 'pol')
      expect(filas(container)).toBe(2)
    })

    it('elimina solo si se confirma (mock de window.confirm)', () => {
      const onEliminar = jasmine.createSpy('onEliminar')
      const confirmar = spyOn(window, 'confirm').and.returnValues(false, true)
      render(<AdminProductos productos={productos} onEliminar={onEliminar} />)
      fireEvent.click(screen.getAllByText('Eliminar')[0])
      expect(onEliminar).not.toHaveBeenCalled()
      fireEvent.click(screen.getAllByText('Eliminar')[0])
      expect(onEliminar).toHaveBeenCalledWith(1)
      expect(confirmar).toHaveBeenCalledTimes(2)
    })

    it('el listado crítico muestra los productos con poco stock', () => {
      render(<AdminCriticos productos={productos} />)
      expect(screen.getByText('Suéter')).toBeTruthy()
      expect(screen.queryByText('Blusa')).toBeNull()
    })

    it('un producto con stock 0 aparece como agotado', () => {
      render(<AdminCriticos productos={[{ ...productos[0], stock: 0 }]} />)
      expect(screen.getByText('Agotado')).toBeTruthy()
    })

    it('sin productos críticos muestra el mensaje de éxito', () => {
      render(<AdminCriticos productos={productos.map(p => ({ ...p, stock: 50 }))} />)
      expect(screen.getByRole('status').textContent).toContain('stock suficiente')
    })
  })

  describe('Usuarios', () => {
    it('muestra el error devuelto al eliminar (mock)', () => {
      spyOn(window, 'confirm').and.returnValue(true)
      const onEliminar = jasmine.createSpy('onEliminar').and.returnValue({ ok: false, error: 'No puedes eliminar tu propia cuenta' })
      render(<AdminUsuarios usuarios={usuarios} sesion={sesionAdmin} onEliminar={onEliminar} />)
      fireEvent.click(screen.getAllByText('Eliminar')[0])
      expect(screen.getByRole('alert').textContent).toContain('propia cuenta')
    })

    it('no elimina si se cancela la confirmación', () => {
      spyOn(window, 'confirm').and.returnValue(false)
      const onEliminar = jasmine.createSpy('onEliminar')
      render(<AdminUsuarios usuarios={usuarios} sesion={sesionAdmin} onEliminar={onEliminar} />)
      fireEvent.click(screen.getAllByText('Eliminar')[1])
      expect(onEliminar).not.toHaveBeenCalled()
    })

    it('crea un usuario nuevo con los datos del formulario', () => {
      const onGuardar = jasmine.createSpy('onGuardar').and.returnValue({ ok: true })
      render(<AdminUsuarioForm usuarios={usuarios} onGuardar={onGuardar} />)
      escribir(/^RUN/, '12345678-5')
      escribir(/^Nombre/, 'Carla')
      escribir(/^Apellidos/, 'Rojas')
      escribir(/^Correo/, 'carla@x.cl')
      escribir(/^Contraseña/, 'secreta')
      escribir(/^Rol/, 'admin')
      fireEvent.click(screen.getByText('Crear usuario'))
      expect(onGuardar.calls.mostRecent().args[0].rol).toBe('admin')
      expect(onGuardar.calls.mostRecent().args[1]).toBeNull()
      expect(ultimaRuta()).toBe('/admin/usuarios')
    })

    it('al crear exige la contraseña', () => {
      const onGuardar = jasmine.createSpy('onGuardar')
      render(<AdminUsuarioForm usuarios={usuarios} onGuardar={onGuardar} />)
      fireEvent.click(screen.getByText('Crear usuario'))
      expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeTruthy()
      expect(onGuardar).not.toHaveBeenCalled()
    })

    it('al editar la contraseña es opcional y el RUN no se puede cambiar', () => {
      configurarRuta({ params: { run: cliente.run } })
      const onGuardar = jasmine.createSpy('onGuardar').and.returnValue({ ok: true })
      render(<AdminUsuarioForm usuarios={usuarios} onGuardar={onGuardar} />)
      expect((screen.getByLabelText(/^RUN/) as HTMLInputElement).disabled).toBeTrue()
      fireEvent.click(screen.getByText('Guardar cambios'))
      expect(onGuardar.calls.mostRecent().args[1]).toBe(cliente.run)
    })

    it('muestra el error general si onGuardar falla (mock)', () => {
      configurarRuta({ params: { run: cliente.run } })
      const onGuardar = jasmine.createSpy('onGuardar').and.returnValue({ ok: false, error: 'Ya existe otra cuenta con ese correo' })
      render(<AdminUsuarioForm usuarios={usuarios} onGuardar={onGuardar} />)
      fireEvent.click(screen.getByText('Guardar cambios'))
      expect(screen.getByRole('alert').textContent).toContain('Ya existe')
    })

    it('editar un usuario inexistente muestra el aviso', () => {
      configurarRuta({ params: { run: '1-9' } })
      render(<AdminUsuarioForm usuarios={usuarios} onGuardar={() => ({ ok: true })} />)
      expect(screen.getByText('Usuario no encontrado')).toBeTruthy()
    })

    it('el detalle muestra el historial de compras del usuario', () => {
      configurarRuta({ params: { run: cliente.run } })
      const { container } = render(<AdminUsuarioDetalle usuarios={usuarios} ordenes={ordenes} />)
      expect(filas(container)).toBe(2)
      // total comprado (solo pagadas) + una fila por orden
      expect(screen.getAllByText('$11.980').length).toBe(3)
    })

    it('el detalle de un usuario sin compras muestra el aviso', () => {
      configurarRuta({ params: { run: ADMIN_INICIAL.run } })
      render(<AdminUsuarioDetalle usuarios={usuarios} ordenes={ordenes} />)
      expect(screen.getByRole('status').textContent).toContain('no tiene compras')
    })

    it('el detalle de un usuario inexistente muestra el aviso', () => {
      configurarRuta({ params: { run: '1-9' } })
      render(<AdminUsuarioDetalle usuarios={usuarios} ordenes={ordenes} />)
      expect(screen.getByText('Usuario no encontrado')).toBeTruthy()
    })
  })

  describe('Reportes y perfil', () => {
    it('reportes calcula ingresos y lista los más vendidos', () => {
      render(<AdminReportes ordenes={ordenes} productos={productos} categorias={categorias} />)
      expect(screen.getAllByText('$11.980').length).toBeGreaterThan(0)
      expect(screen.getByText('2 u.')).toBeTruthy()
    })

    it('reportes sin ventas muestra el aviso', () => {
      render(<AdminReportes ordenes={[]} productos={productos} categorias={categorias} />)
      expect(screen.getByRole('status').textContent).toContain('Sin ventas')
    })

    it('perfil guarda los cambios y muestra confirmación', () => {
      const onGuardar = jasmine.createSpy('onGuardar').and.returnValue({ ok: true })
      render(<AdminPerfil sesion={sesionAdmin} onGuardar={onGuardar} />)
      escribir(/^Nombre/, 'Administradora')
      fireEvent.click(screen.getByText('Guardar cambios'))
      expect(onGuardar.calls.mostRecent().args[0].nombre).toBe('Administradora')
      expect(screen.getByRole('alert').textContent).toBe('Perfil actualizado.')
    })

    it('perfil muestra el error si no se pudo guardar (mock)', () => {
      const onGuardar = jasmine.createSpy('onGuardar').and.returnValue({ ok: false, error: 'Ya existe otra cuenta con ese correo' })
      render(<AdminPerfil sesion={sesionAdmin} onGuardar={onGuardar} />)
      fireEvent.click(screen.getByText('Guardar cambios'))
      expect(screen.getByRole('alert').classList.contains('alert-danger')).toBeTrue()
    })

    it('perfil no guarda si la confirmación no coincide', () => {
      const onGuardar = jasmine.createSpy('onGuardar')
      render(<AdminPerfil sesion={sesionAdmin} onGuardar={onGuardar} />)
      escribir(/^Nueva contraseña/, 'nueva123')
      fireEvent.click(screen.getByText('Guardar cambios'))
      expect(onGuardar).not.toHaveBeenCalled()
    })
  })
})
