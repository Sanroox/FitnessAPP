import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import cliente from '../api/cliente'
import '../paginas/Auth.css'

export default function CrearRutina() {
  const navegar = useNavigate()
  const [formulario, setFormulario] = useState({ nombre: '', descripcion: '' })
  const [error,      setError]      = useState('')
  const [cargando,   setCargando]   = useState(false)

  const set = (k) => (e) => setFormulario(f => ({ ...f, [k]: e.target.value }))

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      const res = await cliente.post('/rutinas', formulario)
      navegar(`/mis-rutinas/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la rutina.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="page-wrap-sm">
      <Link to="/mis-rutinas" className="det-back">← Mis rutinas</Link>

      <div className="crear-card">
        <h1 className="page-titulo" style={{ marginBottom: '1.8rem' }}>
          NUEVA <em>RUTINA</em>
        </h1>

        {error && <div className="r-err">{error}</div>}

        <form onSubmit={manejarEnvio}>
          <div className="r-field">
            <label className="r-label">Nombre de la rutina *</label>
            <input
              className="r-input"
              value={formulario.nombre}
              onChange={set('nombre')}
              placeholder="Ej: Día de piernas, Torso A..."
              required
            />
          </div>
          <div className="r-field">
            <label className="r-label">Descripción (opcional)</label>
            <textarea
              className="r-textarea"
              rows={3}
              value={formulario.descripcion}
              onChange={set('descripcion')}
              placeholder="Describe el objetivo de esta rutina..."
            />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="r-btn" style={{ flex: 1, justifyContent: 'center' }} disabled={cargando}>
              {cargando ? 'Creando...' : 'Crear rutina'}
            </button>
            <Link to="/mis-rutinas" className="r-btn-sec">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}