import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexto/ContextoAuth'
import './auth.css'

export default function InicioSesion() {
  const { iniciarSesion } = useAuth()
  const navegar = useNavigate()

  const [formulario, setFormulario] = useState({ email: '', contrasena: '' })
  const [error,    setError]    = useState('')
  const [cargando, setCargando] = useState(false)

  const set = (k) => (e) => setFormulario(f => ({ ...f, [k]: e.target.value }))

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      await iniciarSesion(formulario.email, formulario.contrasena)
      navegar('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-form-panel">
        <div className="auth-form-box">

          <div className="auth-brand-logo">FITAPP</div>

          <h2 className="auth-form-title">Bienvenido de nuevo</h2>
          <p className="auth-form-desc">Accede a tus rutinas y sigue progresando.</p>

          {error && <div className="auth-err-banner">{error}</div>}

          <form onSubmit={manejarEnvio}>
            <div className="auth-field">
              <label className="auth-label">Email</label>
              <input
                type="email"
                className="auth-input"
                value={formulario.email}
                onChange={set('email')}
                placeholder="tu@email.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Contraseña</label>
              <input
                type="password"
                className="auth-input"
                value={formulario.contrasena}
                onChange={set('contrasena')}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={cargando}>
              {cargando ? 'Entrando...' : 'Iniciar sesión →'}
            </button>
          </form>

          <p className="auth-footer">
            ¿Sin cuenta?{' '}
            <Link to="/registro">Regístrate gratis</Link>
          </p>
        </div>
      </div>
    </div>
  )
}