import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../hooks/useLocalStorage'

describe('useLocalStorage', () => {
  it('usa el valor inicial si no hay nada guardado (mock de getItem)', () => {
    spyOn(Storage.prototype, 'getItem').and.returnValue(null)
    const { result } = renderHook(() => useLocalStorage('clave', 'inicial'))
    expect(result.current[0]).toBe('inicial')
  })

  it('lee el valor guardado (mock de getItem)', () => {
    spyOn(Storage.prototype, 'getItem').and.returnValue(JSON.stringify([1, 2]))
    const { result } = renderHook(() => useLocalStorage('clave', []))
    expect(result.current[0]).toEqual([1, 2])
  })

  it('guarda en localStorage al cambiar el valor (spy de setItem)', () => {
    const setItem = spyOn(Storage.prototype, 'setItem')
    const { result } = renderHook(() => useLocalStorage('clave', 0))
    act(() => result.current[1](5))
    expect(setItem).toHaveBeenCalledWith('clave', '5')
  })
})