// Tipos compartidos por toda la aplicación

export interface Producto {
  id: number
  nombre: string
  categoria: string
  precio: number
  precioOferta?: number
  stock: number
  imagen: string
  descripcion: string
}

// Lo que escribe el admin en el formulario (los inputs siempre entregan texto)
export interface DatosProducto {
  nombre: string
  categoria: string
  precio: string
  precioOferta: string
  stock: string
  imagen: string
  descripcion: string
}

export interface ItemCarrito {
  id: number
  nombre: string
  imagen: string
  precio: number
  cantidad: number
  stock?: number
}

export type Rol = 'cliente' | 'admin'

export interface Direccion {
  calle: string
  departamento?: string
  region: string
  comuna: string
}

export interface Usuario {
  run: string
  nombre: string
  apellidos?: string
  correo: string
  password: string
  rol: Rol
  direccion?: Direccion
}

// Datos que se guardan en la sesión: nunca la contraseña
export type UsuarioPublico = Omit<Usuario, 'password'>

export interface DatosCliente {
  nombre: string
  apellidos: string
  correo: string
  calle: string
  departamento: string
  region: string
  comuna: string
  indicaciones: string
}

export type EstadoOrden = 'pagada' | 'rechazada'

export type ItemOrden = Omit<ItemCarrito, 'stock'>

export interface Orden {
  numero: number
  codigo: string
  fecha: string
  estado: EstadoOrden
  cliente: DatosCliente
  items: ItemOrden[]
  total: number
}

export interface EntradaBlog {
  id: number
  titulo: string
  fecha: string
  imagen: string
  resumen: string
  contenido: string[]
}

export interface Region {
  nombre: string
  comunas: string[]
}

// Resultado de una operación que puede fallar con un mensaje para el usuario
export type Resultado<T extends object = object> = ({ ok: true } & T) | { ok: false; error: string }
