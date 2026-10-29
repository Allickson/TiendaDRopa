import {
  validarCategoria, agregarCategoria, renombrarCategoria, eliminarCategoria, contarPorCategoria
} from '@/utils/categorias'

describe('utils/categorias', () => {
  const categorias = ['Superior', 'Inferior']
  const productos = [{ id: 1, categoria: 'Superior' }, { id: 2, categoria: 'Inferior' }]

  it('valida largo mínimo y nombres repetidos', () => {
    expect(validarCategoria(categorias, 'ab')).toContain('al menos 3')
    expect(validarCategoria(categorias, 'superior')).toContain('Ya existe')
    expect(validarCategoria(categorias, 'Accesorios')).toBe('')
  })

  it('permite guardar una categoría con su mismo nombre al editarla', () => {
    expect(validarCategoria(categorias, 'Superior', 'Superior')).toBe('')
  })

  it('agrega una categoría sin espacios sobrantes', () => {
    expect(agregarCategoria(categorias, '  Accesorios ')).toEqual(['Superior', 'Inferior', 'Accesorios'])
  })

  it('al renombrar actualiza también los productos de esa categoría', () => {
    const r = renombrarCategoria(categorias, productos, 'Superior', 'Tops')
    expect(r.categorias).toEqual(['Tops', 'Inferior'])
    expect(r.productos[0].categoria).toBe('Tops')
    expect(r.productos[1].categoria).toBe('Inferior')
  })

  it('no elimina una categoría que tiene productos', () => {
    expect(eliminarCategoria(categorias, productos, 'Superior').ok).toBeFalse()
    const r = eliminarCategoria([...categorias, 'Vacía'], productos, 'Vacía')
    expect(r.ok).toBeTrue()
    expect(r.categorias).not.toContain('Vacía')
  })

  it('cuenta los productos de una categoría', () => {
    expect(contarPorCategoria(productos, 'Inferior')).toBe(1)
  })
})
