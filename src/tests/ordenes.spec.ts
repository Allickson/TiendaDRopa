import { siguienteNumero, crearOrden, buscarOrden, ordenesDeCliente, resumenVentas } from '@/utils/ordenes'

describe('utils/ordenes', () => {
  const carrito = [
    { id: 1, nombre: 'Polera', imagen: '/img/polera.png', precio: 5990, cantidad: 2, stock: 20 },
    { id: 2, nombre: 'Pantalón', imagen: '/img/pantalon.png', precio: 19990, cantidad: 1, stock: 15 }
  ]
  const cliente = { nombre: 'Vero', apellidos: 'Aguilar', correo: 'Vero@Gmail.com' }
  const fecha = new Date('2026-10-29T12:00:00')

  it('siguienteNumero parte en año0001 y luego es correlativo', () => {
    expect(siguienteNumero([], 2026)).toBe(20260001)
    expect(siguienteNumero([{ numero: 20260007 }], 2026)).toBe(20260008)
  })

  it('crearOrden calcula el total y guarda solo los datos necesarios de cada ítem', () => {
    const orden = crearOrden([], carrito, cliente, 'pagada', fecha)
    expect(orden.numero).toBe(20260001)
    expect(orden.codigo).toBe('ORDER60001')
    expect(orden.total).toBe(5990 * 2 + 19990)
    expect(orden.items[0].stock).toBeUndefined()
    expect(orden.estado).toBe('pagada')
  })

  it('buscarOrden acepta el número como texto (viene de la URL)', () => {
    const orden = crearOrden([], carrito, cliente, 'pagada', fecha)
    expect(buscarOrden([orden], '20260001')).toBe(orden)
    expect(buscarOrden([orden], '1')).toBeNull()
  })

  it('ordenesDeCliente filtra por correo sin distinguir mayúsculas', () => {
    const a = crearOrden([], carrito, cliente, 'pagada', fecha)
    const b = crearOrden([a], carrito, { ...cliente, correo: 'otro@x.cl' }, 'pagada', fecha)
    expect(ordenesDeCliente([a, b], 'vero@gmail.com').length).toBe(1)
  })

  it('resumenVentas solo suma las órdenes pagadas y ordena los más vendidos', () => {
    const a = crearOrden([], carrito, cliente, 'pagada', fecha)
    const b = crearOrden([a], carrito, cliente, 'rechazada', fecha)
    const r = resumenVentas([a, b])
    expect(r.pagadas).toBe(1)
    expect(r.rechazadas).toBe(1)
    expect(r.ingresos).toBe(a.total)
    expect(r.masVendidos[0]).toEqual({ nombre: 'Polera', cantidad: 2 })
  })

  it('resumenVentas sin órdenes devuelve ticket promedio 0', () => {
    expect(resumenVentas([]).ticketPromedio).toBe(0)
  })
})
