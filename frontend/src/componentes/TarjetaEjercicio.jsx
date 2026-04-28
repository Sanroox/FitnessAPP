import { Link } from 'react-router-dom'
import '../paginas/Auth.css'

export default function TarjetaEjercicio({ ejercicio }) {
  return (
    <Link to={`/catalogo/${ejercicio.id}`} className="tarjeta-ej">
      {ejercicio.url_gif ? (
        <img
          src={ejercicio.url_gif}
          alt={ejercicio.nombre}
          className="tarjeta-ej-img"
          loading="lazy"
        />
      ) : (
        <div className="tarjeta-ej-img-placeholder">
          {ejercicio.nombre?.slice(0, 2).toUpperCase()}
        </div>
      )}
      <div className="tarjeta-ej-body">
        <p className="tarjeta-ej-grupo">{ejercicio.grupo_muscular}</p>
        <p className="tarjeta-ej-nombre">{ejercicio.nombre}</p>
        {ejercicio.equipamiento && (
          <p className="tarjeta-ej-equipo">{ejercicio.equipamiento}</p>
        )}
      </div>
    </Link>
  )
}