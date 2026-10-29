'use client'
import { createContext, useContext, type ReactNode } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { productos as productosIniciales, categorias as categoriasIniciales } from '@/data/productos'
import {
  ADMIN_INICIAL, registrarUsuario, actualizarUsuario, eliminarUsuario, buscarUsuario, datosPublicos
} from '@/utils/usuarios'
import { precioFinal, guardarProducto, eliminarProducto } from '@/utils/productos'
import { agregarCategoria, renombrarCategoria, eliminarCategoria } from '@/utils/categorias'
import { crearOrden } from '@/utils/ordenes'
import {
  agregarAlCarrito, cambiarCantidad, eliminarDelCarrito, contarItems,
  calcularTotal, descontarStock, hayStock, sincronizarCarrito
} from '@/utils/carrito'
import type {
  DatosCliente, DatosProducto, ItemCarrito, Orden, Producto, Resultado, Rol, Usuario, UsuarioPublico
} from '@/tipos'

type ResultadoUsuarios = Resultado<{ usuarios: Usuario[] }>

export interface DatosUsuarioForm {
  run: string
  nombre: string
  apellidos: string
  correo: string
  password: string
  rol: Rol
}

export interface Tienda {
  carrito: ItemCarrito[]
  productos: Producto[]
  categorias: string[]
  usuarios: Usuario[]
  ordenes: Orden[]
  sesion: UsuarioPublico | null
  totalItems: number
  totalPrecio: number
  // carrito y compra
  agregar: (p: Producto) => void
  cambiarCantidad: (id: number, delta: number) => void
  eliminarDelCarrito: (id: number) => void
  vaciarCarrito: () => void
  pagar: (cliente: DatosCliente) => Orden
  // productos y categorías
  guardarProducto: (datos: DatosProducto, id: number | null) => void
  eliminarProducto: (id: number) => void
  agregarCategoria: (nombre: string) => void
  renombrarCategoria: (actual: string, nuevo: string) => void
  eliminarCategoria: (nombre: string) => Resultado
  // usuarios y sesión
  registrar: (datos: Omit<Usuario, 'rol'>) => Resultado
  guardarUsuario: (datos: DatosUsuarioForm, run: string | null) => Resultado
  eliminarUsuario: (run: string) => Resultado
  guardarPerfil: (datos: Partial<Usuario>) => Resultado
  iniciarSesion: (usuario: UsuarioPublico) => void
  cerrarSesion: () => void
}

const TiendaContext = createContext<Tienda | null>(null)

export function useTienda(): Tienda {
  const tienda = useContext(TiendaContext)
  if (!tienda) throw new Error('useTienda debe usarse dentro de <TiendaProvider>')
  return tienda
}

// Estado global de la tienda persistido en localStorage (la "base de datos" del frontend)
export function TiendaProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito, l1] = useLocalStorage<ItemCarrito[]>('pinkie_carrito', [])
  const [productos, setProductos, l2] = useLocalStorage<Producto[]>('pinkie_productos', productosIniciales)
  const [categorias, setCategorias, l3] = useLocalStorage<string[]>('pinkie_categorias', categoriasIniciales)
  const [usuarios, setUsuarios, l4] = useLocalStorage<Usuario[]>('pinkie_usuarios', [ADMIN_INICIAL])
  const [ordenes, setOrdenes, l5] = useLocalStorage<Orden[]>('pinkie_ordenes', [])
  const [sesion, setSesion, l6] = useLocalStorage<UsuarioPublico | null>('pinkie_sesion', null)
  const listo = l1 && l2 && l3 && l4 && l5 && l6

  // Aplica el resultado de una operación de usuarios solo si salió bien
  function aplicar(r: ResultadoUsuarios): Resultado {
    if (r.ok) setUsuarios(r.usuarios)
    return r
  }

  const tienda: Tienda = {
    carrito, productos, categorias, usuarios, ordenes, sesion,
    totalItems: contarItems(carrito),
    totalPrecio: calcularTotal(carrito),

    agregar: p => setCarrito(c => agregarAlCarrito(c, {
      id: p.id, nombre: p.nombre, imagen: p.imagen, precio: precioFinal(p), stock: p.stock
    })),
    cambiarCantidad: (id, delta) => setCarrito(c => cambiarCantidad(c, id, delta)),
    eliminarDelCarrito: id => setCarrito(c => eliminarDelCarrito(c, id)),
    vaciarCarrito: () => setCarrito([]),

    pagar(cliente) {
      const pagada = hayStock(carrito, productos)
      const orden = crearOrden(ordenes, carrito, cliente, pagada ? 'pagada' : 'rechazada')
      setOrdenes(os => [...os, orden])
      if (pagada) {
        setProductos(ps => descontarStock(ps, carrito))
        setCarrito([])
      } else {
        setCarrito(c => sincronizarCarrito(c, productos, precioFinal))
      }
      return orden
    },

    guardarProducto: (datos, id) => setProductos(ps => guardarProducto(ps, datos, id)),
    eliminarProducto: id => setProductos(ps => eliminarProducto(ps, id)),
    agregarCategoria: nombre => setCategorias(cs => agregarCategoria(cs, nombre)),
    renombrarCategoria(actual, nuevo) {
      const r = renombrarCategoria(categorias, productos, actual, nuevo)
      setCategorias(r.categorias)
      setProductos(r.productos)
    },
    eliminarCategoria(nombre) {
      const r = eliminarCategoria(categorias, productos, nombre)
      if (r.ok) setCategorias(r.categorias)
      return r
    },

    registrar: datos => aplicar(registrarUsuario(usuarios, datos)),
    guardarUsuario(datos, run) {
      return aplicar(run
        ? actualizarUsuario(usuarios, run, { ...datos, run })
        : registrarUsuario(usuarios, datos, datos.rol))
    },
    eliminarUsuario: run => aplicar(eliminarUsuario(usuarios, run, sesion?.run)),
    guardarPerfil(datos) {
      if (!sesion) return { ok: false, error: 'No hay sesión iniciada' }
      const r = actualizarUsuario(usuarios, sesion.run, datos)
      if (r.ok) {
        setUsuarios(r.usuarios)
        setSesion(datosPublicos(buscarUsuario(r.usuarios, sesion.run)!))
      }
      return r
    },
    iniciarSesion: usuario => setSesion(usuario),
    cerrarSesion: () => setSesion(null)
  }

  // Hasta leer localStorage se muestra un indicador: evita mostrar datos iniciales
  // por un instante y que el panel admin redirija antes de saber si hay sesión.
  return (
    <TiendaContext.Provider value={tienda}>
      {listo ? children : (
        <div className="d-flex justify-content-center align-items-center flex-grow-1 py-5" role="status">
          <div className="spinner-border text-secondary" aria-hidden="true"></div>
          <span className="visually-hidden">Cargando tienda…</span>
        </div>
      )}
    </TiendaContext.Provider>
  )
}
