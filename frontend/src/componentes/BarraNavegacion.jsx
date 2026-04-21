import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexto/ContextoAuth'
import '../paginas/Auth.css'

export default function BarraNavegacion() {
  const { usuario, cerrarSesion } = useAuth()
  const navegar   = useNavigate()
  const ubicacion = useLocation()

  const manejarCierreSesion = async () => {
    await cerrarSesion()
    navegar('/inicio-sesion')
  }

  const esActivo = (ruta) =>
    ubicacion.pathname === ruta || ubicacion.pathname.startsWith(ruta + '/')
      ? 'nav-link activo'
      : 'nav-link'

  if (!usuario) return null

  return (
    <nav className="nav">
      <div className="nav-inner">

        <Link to="/" className="nav-logo">FITAPP</Link>

        <div className="nav-links">
          <Link to="/"            className={esActivo('/')}>Inicio</Link>
          <Link to="/catalogo"    className={esActivo('/catalogo')}>Ejercicios</Link>
          <Link to="/mis-rutinas" className={esActivo('/mis-rutinas')}>Mis rutinas</Link>
          {usuario.rol === 'admin' && (
            <Link to="/panel-admin" className={esActivo('/panel-admin')}>Admin</Link>
          )}
        </div>

        <div className="nav-usuario">
          <span className="nav-saludo">
            Hola, <strong>{usuario.nombre.split(' ')[0]}</strong>
          </span>
          <button onClick={manejarCierreSesion} className="nav-btn-salir">
            Cerrar sesión
          </button>
        </div>

      </div>
    </nav>
  )
}