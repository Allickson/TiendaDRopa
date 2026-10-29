import { Routes, Route } from 'react-router-dom'
import Navbar from './componentes/Navbar'
import Footer from './componentes/Footer'
import RutaAdmin from './componentes/RutaAdmin'
import Home from './paginas/Home'
import Ofertas from './paginas/Ofertas'
import DetalleProducto from './paginas/DetalleProducto'
import Nosotros from './paginas/Nosotros'
import Blog from './paginas/Blog'
import Contacto from './paginas/Contacto'
import Carrito from './paginas/Carrito'
import Comprar from './paginas/Comprar'
import CompraOk from './paginas/CompraOk'
import CompraError from './paginas/CompraError'
import IniciarSesion from './paginas/IniciarSesion'
import CrearCuenta from './paginas/CrearCuenta'
import Admin from './paginas/Admin'
import NoEncontrado from './paginas/NoEncontrado'
import { useLocalStorage } from './hooks/useLocalStorage'
import { productos as productosIniciales } from './data/productos'
import { ADMIN_INICIAL } from './utils/usuarios'
import { precioFinal } from './utils/productos'
import {
  agregarAlCarrito, cambiarCantidad, eliminarDelCarrito,
  contarItems, calcularTotal, descontarStock
} from './utils/carrito'

export default function App() {
  const [carrito, setCarrito] = useLocalStorage('pinkie_carrito', [])
  const [productos, setProductos] = useLocalStorage('pinkie_productos', productosIniciales)
  const [usuarios, setUsuarios] = useLocalStorage('pinkie_usuarios', [ADMIN_INICIAL])
  const [sesion, setSesion] = useLocalStorage('pinkie_sesion', null)

  const agregar = p => setCarrito(c => agregarAlCarrito(c, { ...p, precio: precioFinal(p) }))

  function confirmarCompra() {
    setProductos(ps => descontarStock(ps, carrito))
    setCarrito([])
  }

  return (
    <>
      <Navbar
        totalItems={contarItems(carrito)}
        totalPrecio={calcularTotal(carrito)}
        sesion={sesion}
        onSalir={() => setSesion(null)}
      />
      <Routes>
        <Route path="/" element={<Home productos={productos} onAgregar={agregar} />} />
        <Route path="/ofertas" element={<Ofertas productos={productos} onAgregar={agregar} />} />
        <Route path="/producto/:id" element={<DetalleProducto productos={productos} onAgregar={agregar} />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route
          path="/carrito"
          element={
            <Carrito
              carrito={carrito}
              onCambiarCantidad={(id, delta) => setCarrito(c => cambiarCantidad(c, id, delta))}
              onEliminar={id => setCarrito(c => eliminarDelCarrito(c, id))}
            />
          }
        />
        <Route
          path="/comprar"
          element={<Comprar carrito={carrito} productos={productos} sesion={sesion} onConfirmar={confirmarCompra} />}
        />
        <Route path="/comprar/ok" element={<CompraOk />} />
        <Route path="/comprar/error" element={<CompraError />} />
        <Route path="/iniciar-sesion" element={<IniciarSesion usuarios={usuarios} onIngresar={setSesion} />} />
        <Route path="/crear-cuenta" element={<CrearCuenta usuarios={usuarios} onRegistrar={setUsuarios} />} />
        <Route
          path="/admin"
          element={
            <RutaAdmin sesion={sesion}>
              <Admin productos={productos} onCambiarProductos={setProductos} />
            </RutaAdmin>
          }
        />
        <Route path="*" element={<NoEncontrado />} />
      </Routes>
      <Footer />
    </>
  )
}
