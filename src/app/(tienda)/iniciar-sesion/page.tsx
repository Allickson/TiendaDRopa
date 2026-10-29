'use client'
import IniciarSesion from '@/paginas/IniciarSesion'
import { useTienda } from '@/context/TiendaContext'

export default function Page() {
  const t = useTienda()
  return <IniciarSesion usuarios={t.usuarios} onIngresar={t.iniciarSesion} />
}
