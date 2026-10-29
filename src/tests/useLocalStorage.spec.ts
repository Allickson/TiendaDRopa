import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

describe('useLocalStorage', () => {
  it('usa el valor inicial si no hay nada guardado (mock de getItem)', () => {
    spyOn(Storage.prototype, 'getItem').and.returnValue(null)
    const { result } = renderHook(() => useLocalStorage('clave', 'inicial'))
    expect(result.current[0]).toBe('inicial')
    expect(result.current[2]).toBeTrue() // listo
  })

  it('lee el valor guardado después de montar (mock de getItem)', () => {
    spyOn(Storage.prototype, 'getItem').and.returnValue(JSON.stringify([1, 2]))
    const { result } = renderHook(() => useLocalStorage<number[]>('clave', []))
    expect(result.current[0]).toEqual([1, 2])
  })

  it('guarda en localStorage al cambiar el valor (spy de setItem)', () => {
    spyOn(Storage.prototype, 'getItem').and.returnValue(null)
    const setItem = spyOn(Storage.prototype, 'setItem')
    const { result } = renderHook(() => useLocalStorage('clave', 0))
    act(() => result.current[1](5))
    expect(setItem).toHaveBeenCalledWith('clave', '5')
  })

  it('no pisa lo guardado con el valor inicial al montar', () => {
    spyOn(Storage.prototype, 'getItem').and.returnValue('"guardado"')
    const setItem = spyOn(Storage.prototype, 'setItem')
    renderHook(() => useLocalStorage('clave', 'inicial'))
    expect(setItem).not.toHaveBeenCalledWith('clave', '"inicial"')
  })

  it('si lo guardado está corrupto usa el valor inicial', () => {
    spyOn(Storage.prototype, 'getItem').and.returnValue('{no es json')
    const { result } = renderHook(() => useLocalStorage('clave', 'inicial'))
    expect(result.current[0]).toBe('inicial')
  })
})
