import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import cliente from '../api/cliente'
import '../paginas/Auth.css'

export default function DetalleEjercicio() {
  const { id } = useParams()
  const [ejercicio, setEjercicio] = useState(null)
  const [cargando,  setCargando]  = useState(true)

  useEffect(() => {
    cliente.get(`/ejercicios/${id}`)
      .then(res => setEjercicio(res.data))
      .finally(() => setCargando(false))
  }, [id])

  if (cargando) return (
    <div className="cat-spinner" style={{ paddingTop: '6rem' }}>
      <div className="cat-spinner-ring" />
    </div>
  )

  if (!ejercicio) return (
    <div className="det-wrap" style={{ textAlign: 'center', paddingTop: '5rem' }}>
      <p style={{ color: 'var(--auth-muted)', marginBottom: '1rem' }}>Ejercicio no encontrado.</p>
      <Link to="/catalogo" className="det-back">← Volver al catálogo</Link>
    </div>
  )

  return (
    <div className="det-wrap">

      <Link to="/catalogo" className="det-back">← Volver al catálogo</Link>

      <div className="det-card">

        {ejercicio.url_gif && (
          <img
            src={ejercicio.url_gif}
            alt={ejercicio.nombre}
            className="det-gif"
          />
        )}

        <div className="det-body">
          <p className="det-grupo">{ejercicio.grupo_muscular}</p>
          <h1 className="det-nombre">{ejercicio.nombre}</h1>

          <div className="det-stats">
            {[
              ['Músculo objetivo', ejercicio.musculo_objetivo],
              ['Equipamiento',     ejercicio.equipamiento],
              ['Grupo muscular',   ejercicio.grupo_muscular],
            ].filter(([, v]) => v).map(([label, valor]) => (
              <div key={label} className="det-stat">
                <p className="det-stat-label">{label}</p>
                <p className="det-stat-valor">{valor}</p>
              </div>
            ))}
          </div>

          {ejercicio.instrucciones && (
            <>
              <hr className="det-sep" />
              <h2 className="det-instrucciones-titulo">INSTRUCCIONES</h2>
              <p className="det-instrucciones-texto">{ejercicio.instrucciones}</p>
            </>
          )}
        </div>

      </div>
    </div>
  )
}