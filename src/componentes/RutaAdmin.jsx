import { Navigate } from 'react-router-dom'

export default function RutaAdmin({ sesion, children }) {
  if (!sesion || sesion.rol !== 'admin') {
    return <Navigate to="/iniciar-sesion" replace />
  }
  return children
}