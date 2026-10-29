import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './componentes/Navbar'
import Footer from './componentes/Footer'
import Home from './paginas/Home'
import Carrito from './paginas/Carrito'
import Contacto from './paginas/Contacto'
import {
  agregarAlCarrito, cambiarCantidad, eliminarDelCarrito, contarItems
} from './utils/carrito'

export default function App() {
  const [carrito, setCarrito] = useState([])

  return (
    <>
      <Navbar totalItems={contarItems(carrito)} />
      <Routes>
        <Route
          path="/"
          element={<Home onAgregar={p => setCarrito(c => agregarAlCarrito(c, p))} />}
        />
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
        <Route path="/contacto" element={<Contacto />} />
      </Routes>
      <Footer />
    </>
  )
}
