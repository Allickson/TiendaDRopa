'use client'
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CampoFormulario, { type EventoCampo } from '@/componentes/CampoFormulario'
import TablaItems from '@/componentes/TablaItems'
import type { DatosCliente, ItemCarrito, Orden, UsuarioPublico } from '@/tipos'
import { calcularTotal } from '@/utils/carrito'
import { formatoPrecio } from '@/utils/formato'
import { regiones, comunasDe } from '@/data/regiones'
import {
  validarNombre, validarApellidos, validarEmail, validarDireccion,
  validarSeleccion, validarFormulario, hayErrores, type Errores, type Regla
} from '@/utils/validaciones'

const reglas: Regla<DatosCliente>[] = [
  { name: 'nombre', validar: validarNombre },
  { name: 'apellidos', validar: validarApellidos },
  { name: 'correo', validar: validarEmail },
  { name: 'calle', validar: validarDireccion },
  { name: 'region', validar: v => validarSeleccion(v, 'región') },
  { name: 'comuna', validar: v => validarSeleccion(v, 'comuna') }
]

// Si hay sesión iniciada, los datos del cliente se completan solos
function valoresIniciales(sesion: Partial<UsuarioPublico> | null): DatosCliente {
  const d = sesion?.direccion
  return {
    nombre: sesion?.nombre ?? '',
    apellidos: sesion?.apellidos ?? '',
    correo: sesion?.correo ?? '',
    calle: d?.calle ?? '',
    departamento: d?.departamento ?? '',
    region: d?.region ?? '',
    comuna: d?.comuna ?? '',
    indicaciones: ''
  }
}

interface Props {
  carrito: ItemCarrito[]
  sesion: Partial<UsuarioPublico> | null
  onPagar: (cliente: DatosCliente) => Pick<Orden, 'numero' | 'estado'>
}

export default function Comprar({ carrito, sesion, onPagar }: Props) {
  const router = useRouter()
  const [valores, setValores] = useState<DatosCliente>(() => valoresIniciales(sesion))
  const [errores, setErrores] = useState<Errores<DatosCliente>>({})

  if (carrito.length === 0) {
    return (
      <div className="container py-4 text-center">
        <h1 className="mb-3">Finalizar compra</h1>
        <p>Tu carrito está vacío.</p>
        <Link href="/productos" className="btn btn-primary">Ver catálogo</Link>
      </div>
    )
  }

  const total = calcularTotal(carrito)

  function manejarCambio(e: EventoCampo) {
    const { name, value } = e.target
    // Al cambiar de región se reinicia la comuna, porque las comunas dependen de ella
    setValores(v => (name === 'region' ? { ...v, region: value, comuna: '' } : { ...v, [name]: value }))
  }

  function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    const nuevos = validarFormulario(reglas, valores)
    setErrores(nuevos)
    if (hayErrores(nuevos)) return
    const orden = onPagar(valores)
    router.push(orden.estado === 'pagada' ? `/comprar/ok/${orden.numero}` : `/comprar/error/${orden.numero}`)
  }

  const campo = (name: keyof DatosCliente, label: string, extra: Partial<Parameters<typeof CampoFormulario>[0]> = {}) => (
    <CampoFormulario name={name} label={label} value={valores[name]} onChange={manejarCambio} error={errores[name]} {...extra} />
  )

  return (
    <div className="container py-4" style={{ maxWidth: '900px' }}>
      <div className="card shadow-sm">
        <div className="card-body p-3 p-md-4">
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
            <div>
              <h1 className="h3 mb-0">Carrito de compra</h1>
              <small className="text-muted">Revisa tus productos y completa tus datos</small>
            </div>
            <span className="badge text-bg-primary fs-6 p-2">Total a pagar: {formatoPrecio(total)}</span>
          </div>

          <TablaItems items={carrito} />

          <form onSubmit={manejarEnvio} noValidate className="mt-4">
            <h2 className="h5">Información del cliente</h2>
            <div className="row">
              {campo('nombre', 'Nombre', { requerido: true, className: 'col-12 col-md-6 mb-3', autoComplete: 'given-name' })}
              {campo('apellidos', 'Apellidos', { requerido: true, className: 'col-12 col-md-6 mb-3', autoComplete: 'family-name' })}
              {campo('correo', 'Correo', { tipo: 'email', requerido: true, className: 'col-12 col-md-6 mb-3', autoComplete: 'email' })}
            </div>

            <h2 className="h5">Dirección de entrega</h2>
            <div className="row">
              {campo('calle', 'Calle y número', { requerido: true, className: 'col-12 col-md-8 mb-3', placeholder: 'Ej: Los Crisantemos 123', autoComplete: 'street-address' })}
              {campo('departamento', 'Departamento (opcional)', { className: 'col-12 col-md-4 mb-3', placeholder: 'Ej: 603' })}
              {campo('region', 'Región', { tipo: 'select', requerido: true, className: 'col-12 col-md-6 mb-3', opciones: regiones.map(r => r.nombre), placeholder: 'Seleccione una región' })}
              {campo('comuna', 'Comuna', { tipo: 'select', requerido: true, className: 'col-12 col-md-6 mb-3', opciones: comunasDe(valores.region), placeholder: valores.region ? 'Seleccione una comuna' : 'Primero elija la región', deshabilitado: !valores.region })}
              {campo('indicaciones', 'Indicaciones para la entrega (opcional)', { tipo: 'textarea', className: 'col-12 mb-3', placeholder: 'Ej: entre calles, color del edificio, no tiene timbre' })}
            </div>
            <div className="text-end">
              <button type="submit" className="btn btn-success">Pagar ahora {formatoPrecio(total)}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
