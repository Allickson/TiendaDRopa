'use client'
import { useEffect } from 'react'

// El JavaScript de Bootstrap (menú colapsable, dropdowns) usa window y document,
// así que se carga solo en el navegador, después de montar.
export default function BootstrapClient() {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js')
  }, [])
  return null
}
