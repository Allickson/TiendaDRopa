import { useState, useEffect } from 'react'

export function useLocalStorage(clave, inicial) {
  const [valor, setValor] = useState(() => {
    try {
      const guardado = localStorage.getItem(clave)
      return guardado !== null ? JSON.parse(guardado) : inicial
    } catch {
      return inicial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor))
    } catch {
      /* sin acceso a localStorage: la app sigue funcionando en memoria */
    }
  }, [clave, valor])

  return [valor, setValor]
}