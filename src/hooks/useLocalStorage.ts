'use client'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

// Estado de React que se guarda en localStorage.
// Next.js renderiza primero en el servidor, donde no existe localStorage: por eso
// el valor guardado se lee DESPUÉS de montar (useEffect) y no en el useState inicial.
// Así el HTML del servidor y el primer render del cliente coinciden (sin error de hidratación).
// "listo" indica si ya se leyó lo guardado; antes de eso no se escribe, para no pisarlo.
export function useLocalStorage<T>(clave: string, inicial: T): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [valor, setValor] = useState<T>(inicial)
  const [listo, setListo] = useState(false)

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(clave)
      if (guardado !== null) setValor(JSON.parse(guardado) as T)
    } catch {
      /* dato corrupto o sin acceso: se usa el valor inicial */
    }
    setListo(true)
  }, [clave])

  useEffect(() => {
    if (!listo) return
    try {
      localStorage.setItem(clave, JSON.stringify(valor))
    } catch {
      /* sin acceso a localStorage: la app sigue funcionando en memoria */
    }
  }, [clave, valor, listo])

  return [valor, setValor, listo]
}
