import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import cliente from '../api/cliente'
import TarjetaRutina from '../componentes/TarjetaRutina'
import '../paginas/Auth.css'

export default function MisRutinas() {
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

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h1 className="page-titulo">MIS <em>RUTINAS</em></h1>
        <Link to="/mis-rutinas/nueva" className="r-btn">+ Nueva rutina</Link>
      </div>

      {cargando ? (
        <div className="cat-spinner"><div className="cat-spinner-ring" /></div>
      ) : rutinas.length === 0 ? (
        <div className="estado-vacio">
          <span className="estado-vacio-num">0</span>
          <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--auth-text)' }}>
            No tienes rutinas todavía
          </p>
          <p>Crea tu primera rutina y empieza a entrenar</p>
          <Link to="/mis-rutinas/nueva" className="r-btn" style={{ marginTop: '1.2rem' }}>
            Crear rutina
          </Link>
        </div>
      ) : (
        <div className="rutinas-grid">
          {rutinas.map(r => (
            <TarjetaRutina key={r.id} rutina={r} alEliminar={manejarEliminar} />
          ))}
        </div>
      )}
    </div>
  )
}