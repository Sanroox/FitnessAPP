import { Link } from 'react-router-dom'
import '../paginas/Auth.css'

export default function TarjetaRutina({ rutina, alEliminar }) {
  return (
    <div className="tarjeta-rutina">
      <div>
        <p className="tr-nombre">{rutina.nombre}</p>
        {rutina.descripcion && (
          <p className="tr-desc" style={{ marginTop: '0.4rem' }}>{rutina.descripcion}</p>
        )}
      </div>

      <div className="tr-meta">
        <span className="tr-badge">
          {rutina.ejercicios_count ?? rutina.ejercicios?.length ?? 0} ejercicios
        </span>
        {rutina.ejercicios?.slice(0, 2).map(e => (
          <span key={e.id} className="tr-ejercicios-preview">
            {e.ejercicio?.nombre ?? e.nombre}
          </span>
        ))}
      </div>

      <div className="tr-acciones">
        <Link to={`/mis-rutinas/${rutina.id}`} className="r-btn" style={{ flex: 1, justifyContent: 'center' }}>
          Ver rutina
        </Link>
        <button
          onClick={() => alEliminar(rutina.id)}
          className="r-btn-danger"
        >
          ✕
        </button>
      </div>
    </div>
  )
}