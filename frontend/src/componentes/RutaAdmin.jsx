import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexto/ContextoAuth'

export default function RutaAdmin() {
  const { usuario, cargando } = useAuth()

  if (cargando) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  )

  if (!usuario) return <Navigate to="/inicio-sesion" replace />
  if (usuario.rol !== 'admin') return <Navigate to="/" replace />

  return <Outlet />
}
