import { render, screen, fireEvent } from '@testing-library/react'
import AdminCategorias from '@/paginas/admin/AdminCategorias'

describe('AdminCategorias', () => {
  const productos = [{ categoria: 'Superior' }]

  function dibujar() {
    const espias = {
      onAgregar: jasmine.createSpy('onAgregar'),
      onRenombrar: jasmine.createSpy('onRenombrar'),
      onEliminar: jasmine.createSpy('onEliminar').and.returnValue({ ok: false, error: 'No se puede eliminar: hay productos en esta categoría' })
    }
    render(<AdminCategorias categorias={['Superior', 'Inferior']} productos={productos} {...espias} />)
    return espias
  }

  it('agrega una categoría válida', () => {
    const { onAgregar } = dibujar()
    fireEvent.change(screen.getByLabelText('Nueva categoría'), { target: { value: 'Accesorios' } })
    fireEvent.click(screen.getByText('Agregar categoría'))
    expect(onAgregar).toHaveBeenCalledWith('Accesorios')
  })

  it('no agrega una repetida y muestra el error', () => {
    const { onAgregar } = dibujar()
    fireEvent.change(screen.getByLabelText('Nueva categoría'), { target: { value: 'superior' } })
    fireEvent.click(screen.getByText('Agregar categoría'))
    expect(onAgregar).not.toHaveBeenCalled()
    expect(screen.getByRole('alert').textContent).toContain('Ya existe')
  })

  it('muestra el error que devuelve onEliminar (mock)', () => {
    dibujar()
    fireEvent.click(screen.getAllByText('Eliminar')[0])
    expect(screen.getByRole('alert').textContent).toContain('hay productos')
  })

  it('al editar cambia a modo input y guarda el nuevo nombre', () => {
    const { onRenombrar } = dibujar()
    fireEvent.click(screen.getAllByText('Editar')[1])
    fireEvent.change(screen.getByLabelText('Nuevo nombre para Inferior'), { target: { value: 'Bottoms' } })
    fireEvent.click(screen.getByText('Guardar'))
    expect(onRenombrar).toHaveBeenCalledWith('Inferior', 'Bottoms')
  })

  it('cancelar la edición vuelve al modo lectura sin guardar', () => {
    const { onRenombrar } = dibujar()
    fireEvent.click(screen.getAllByText('Editar')[0])
    fireEvent.click(screen.getByText('Cancelar'))
    expect(screen.queryByLabelText('Nuevo nombre para Superior')).toBeNull()
    expect(onRenombrar).not.toHaveBeenCalled()
  })

  it('no permite renombrar a un nombre muy corto', () => {
    const { onRenombrar } = dibujar()
    fireEvent.click(screen.getAllByText('Editar')[0])
    fireEvent.change(screen.getByLabelText('Nuevo nombre para Superior'), { target: { value: 'ab' } })
    fireEvent.click(screen.getByText('Guardar'))
    expect(onRenombrar).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toBeTruthy()
  })
})
