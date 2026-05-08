import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexto/ContextoAuth'
import cliente from '../api/cliente'
import TarjetaRutina from '../componentes/TarjetaRutina'
import '../paginas/Auth.css'

export default function PanelPrincipal() {
  const { usuario } = useAuth()
  const [rutinas,  setRutinas]  = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cliente.get('/rutinas')
      .then(res => setRutinas(res.data))
      .finally(() => setCargando(false))
  }, [])

  const manejarEliminar = async (id) => {
    if (!confirm('¿Eliminar esta rutina?')) return
    await cliente.delete(`/rutinas/${id}`)
    setRutinas(prev => prev.filter(r => r.id !== id))
  }

  const nombre = usuario.nombre.split(' ')[0]

  return (
    <div className="page-wrap">

      {/* Hero */}
      <div className="hero-panel">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="hero-saludo">HOLA, <em>{nombre.toUpperCase()}</em></h1>
          <p className="hero-sub">
            {rutinas.length === 0
              ? 'Crea tu primera rutina y empieza a entrenar.'
              : `Tienes ${rutinas.length} rutina${rutinas.length !== 1 ? 's' : ''} activa${rutinas.length !== 1 ? 's' : ''}.`}
          </p>
          <div className="hero-acciones">
            <Link to="/mis-rutinas/nueva" className="r-btn">+ Nueva rutina</Link>
            <Link to="/catalogo" className="r-btn-sec">Ver ejercicios</Link>
          </div>
        </div>
        <div className="hero-stats">
          <div>
            <span className="hero-stat-num">{rutinas.length}</span>
            <span className="hero-stat-lbl">Rutinas</span>
          </div>
          <div>
            <span className="hero-stat-num">
              {rutinas.reduce((acc, r) => acc + (r.ejercicios_count ?? 0), 0)}
            </span>
            <span className="hero-stat-lbl">Ejercicios totales</span>
          </div>
        </div>
      </div>

      {/* Rutinas recientes */}
      <div className="page-header" style={{ marginBottom: '1.2rem' }}>
        <h2 className="page-titulo" style={{ fontSize: '1.3rem' }}>MIS <em>RUTINAS</em></h2>
        {rutinas.length > 3 && (
          <Link to="/mis-rutinas" className="r-btn-sec" style={{ fontSize: '0.75rem' }}>
            Ver todas →
          </Link>
        )}
      </div>

      {cargando ? (
        <div className="cat-spinner"><div className="cat-spinner-ring" /></div>
      ) : rutinas.length === 0 ? (
        <div className="estado-vacio">
          <span className="estado-vacio-num">0</span>
          <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--auth-text)' }}>
            Aún no tienes ninguna rutina
          </p>
          <p>Crea la primera y empieza a entrenar</p>
          <Link to="/mis-rutinas/nueva" className="r-btn" style={{ marginTop: '1.2rem' }}>
            Crear rutina
          </Link>
        </div>
      ) : (
        <div className="rutinas-grid">
          {rutinas.slice(0, 6).map(r => (
            <TarjetaRutina key={r.id} rutina={r} alEliminar={manejarEliminar} />
          ))}
        </div>
      )}
    </div>
  )
}