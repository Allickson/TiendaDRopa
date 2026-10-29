'use client'
import Comprar from '@/paginas/Comprar'
import { useTienda } from '@/context/TiendaContext'

export default function Page() {
  const t = useTienda()
  return <Comprar carrito={t.carrito} sesion={t.sesion} onPagar={t.pagar} />
}
