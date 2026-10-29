import { render, screen, fireEvent } from '@testing-library/react'
import AdminProductoForm from '@/paginas/admin/AdminProductoForm'
import { productos } from '@/data/productos'
import { configurarRuta, ultimaRuta } from './mocks/next-navigation'

describe('AdminProductoForm (formulario del CRUD)', () => {
  function dibujar(params: Record<string, string> = {}) {
    configurarRuta({ params })
    const onGuardar = jasmine.createSpy('onGuardar')
    render(<AdminProductoForm productos={productos} categorias={['Superior', 'Inferior']} onGuardar={onGuardar} />)
    return onGuardar
  }

  const escribir = (label: RegExp, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } })

  it('muestra el error de validación y no guarda si el precio es 0', () => {
    const onGuardar = dibujar()
    escribir(/^Nombre/, 'Abrigo')
    escribir(/^Precio \*/, '0')
    escribir(/^Stock/, '3')
    fireEvent.click(screen.getByText('Agregar producto'))
    expect(screen.getByRole('alert').textContent).toContain('precio')
    expect(onGuardar).not.toHaveBeenCalled()
  })

  it('con datos válidos llama a onGuardar con id null y vuelve al listado', () => {
    const onGuardar = dibujar()
    escribir(/^Nombre/, 'Abrigo')
    escribir(/^Precio \*/, '29990')
    escribir(/^Stock/, '3')
    fireEvent.click(screen.getByText('Agregar producto'))
    expect(onGuardar).toHaveBeenCalledTimes(1)
    expect(onGuardar.calls.mostRecent().args[0].categoria).toBe('Superior')
    expect(onGuardar.calls.mostRecent().args[1]).toBeNull()
    expect(ultimaRuta()).toBe('/admin/productos')
  })

  it('en modo edición carga los datos del producto y guarda con su id', () => {
    const onGuardar = dibujar({ id: '1' })
    expect((screen.getByLabelText(/^Nombre/) as HTMLInputElement).value).toBe('Polera')
    fireEvent.click(screen.getByText('Guardar cambios'))
    expect(onGuardar.calls.mostRecent().args[1]).toBe(1)
  })

  it('si el producto no existe muestra el aviso', () => {
    dibujar({ id: '999' })
    expect(screen.getByText('Producto no encontrado')).toBeTruthy()
  })
})
