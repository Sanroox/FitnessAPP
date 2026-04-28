import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexto/ContextoAuth'
import '../paginas/Auth.css'

export default function BarraNavegacion() {
  const { usuario, cerrarSesion } = useAuth()
  const navegar   = useNavigate()
  const ubicacion = useLocation()
  
  // Estado para el menú móvil
  const [menuAbierto, setMenuAbierto] = useState(false)

  const manejarCierreSesion = async () => {
    await cerrarSesion()
    navegar('/inicio-sesion')
  }

  const esActivo = (ruta) =>
    ubicacion.pathname === ruta || ubicacion.pathname.startsWith(ruta + '/')
      ? 'nav-link activo'
      : 'nav-link'

  const alternarMenu = () => setMenuAbierto(!menuAbierto)
  const cerrarMenu = () => setMenuAbierto(false)

  if (!usuario) return null

  return (
    <nav className="nav">
      <div className="nav-inner">

        <Link to="/" className="nav-logo" onClick={cerrarMenu}>FITAPP</Link>

        {/* Botón Hamburguesa (solo visible en móvil) */}
        <button 
          className="nav-hamburger" 
          onClick={alternarMenu}
          aria-expanded={menuAbierto}
          aria-label="Alternar menú de navegación"
        >
          <span className={`linea ${menuAbierto ? 'abierta' : ''}`}></span>
          <span className={`linea ${menuAbierto ? 'abierta' : ''}`}></span>
          <span className={`linea ${menuAbierto ? 'abierta' : ''}`}></span>
        </button>

        {/* Contenedor del menú */}
        <div className={`nav-menu ${menuAbierto ? 'abierto' : ''}`}>
          <div className="nav-links">
            <Link to="/"            className={esActivo('/')} onClick={cerrarMenu}>Inicio</Link>
            <Link to="/catalogo"    className={esActivo('/catalogo')} onClick={cerrarMenu}>Ejercicios</Link>
            <Link to="/mis-rutinas" className={esActivo('/mis-rutinas')} onClick={cerrarMenu}>Mis rutinas</Link>
            {usuario.rol === 'admin' && (
              <Link to="/panel-admin" className={esActivo('/panel-admin')} onClick={cerrarMenu}>Admin</Link>
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

      </div>
    </nav>
  )
}