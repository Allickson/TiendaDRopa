import type { Orden, Usuario } from '@/tipos'

// Datos de prueba compartidos por varios tests
export const ordenPagada: Orden = {
  numero: 20260001, codigo: 'ORDER60001', fecha: '2026-10-29T12:00:00.000Z', estado: 'pagada', total: 11980,
  cliente: {
    nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@x.cl', calle: 'Los Pinos 1', departamento: '',
    region: 'Región Metropolitana de Santiago', comuna: 'Maipú', indicaciones: ''
  },
  items: [{ id: 1, nombre: 'Polera', precio: 5990, cantidad: 2, imagen: '/img/polera.png' }]
}

export const ordenRechazada: Orden = { ...ordenPagada, numero: 20260002, codigo: 'ORDER60002', estado: 'rechazada' }

export const cliente: Usuario = { run: '22222222-2', nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@x.cl', password: 'secreta', rol: 'cliente' }

export const sesionAdmin = { run: '11111111-1', nombre: 'Admin', apellidos: 'Pinkie', correo: 'admin@pinkie.cl', rol: 'admin' as const }
