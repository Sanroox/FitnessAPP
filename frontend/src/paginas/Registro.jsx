import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexto/ContextoAuth'
import './auth.css'

// 1. EL ARREGLO DEL FOCO: 
// El sub-componente debe vivir SIEMPRE fuera de la función principal.
// Así React sabe que es el mismo componente y no lo destruye al escribir.
const Campo = ({ id, label, type = 'text', placeholder, autoComplete, valor, onChange, error }) => (
  <div className="auth-field">
    {/* 2. EL ARREGLO DE ACCESIBILIDAD: Conectamos label e input con htmlFor e id */}
    <label htmlFor={id} className="auth-label">{label}</label>
    <input
      id={id}
      name={id}
      type={type}
      className={`auth-input${error ? ' err' : ''}`}
      value={valor}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      required
    />
    {error && (
      <p className="auth-err-text">{error[0]}</p>
    )}
  </div>
)

export default function Registro() {
  const { registrar } = useAuth()
  const navegar = useNavigate()

  const [formulario, setFormulario] = useState({
    nombre: '', email: '', contrasena: '', contrasena_confirmation: ''
  })
  const [errores,  setErrores]  = useState({})
  const [cargando, setCargando] = useState(false)

  // 3. EL ARREGLO DE SOBREINGENIERÍA: 
  // Esta es la forma estándar y legible de manejar formularios en React.
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setErrores({})
    setCargando(true)
    try {
      await registrar(
        formulario.nombre,
        formulario.email,
        formulario.contrasena,
        formulario.contrasena_confirmation
      )
      navegar('/')
    } catch (err) {
      const datos = err.response?.data
      if (datos?.errors) setErrores(datos.errors)
      else setErrores({ general: datos?.message || 'Error al registrarse.' })
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-form-panel">
        <div className="auth-form-box">

          <div className="auth-brand-logo">FITAPP</div>

          <h2 className="auth-form-title">Crea tu cuenta</h2>
          <p className="auth-form-desc">Diseña rutinas a medida, registra tu progreso y alcanza objetivos reales.</p>

          {errores.general && (
            <div className="auth-err-banner">{errores.general}</div>
          )}

          <form onSubmit={manejarEnvio}>
            {/* Como 'Campo' ahora vive fuera, tenemos que pasarle los datos por props */}
            <Campo
              id="nombre"
              label="Nombre completo"
              valor={formulario.nombre}
              onChange={manejarCambio}
              error={errores.nombre}
              placeholder="Mario San Román"
              autoComplete="name"
            />
            <Campo
              id="email"
              label="Email"
              type="email"
              valor={formulario.email}
              onChange={manejarCambio}
              error={errores.email}
              placeholder="tu@email.com"
              autoComplete="email"
            />
            <Campo
              id="contrasena"
              label="Contraseña"
              type="password"
              valor={formulario.contrasena}
              onChange={manejarCambio}
              error={errores.contrasena}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
            />
            <Campo
              id="contrasena_confirmation"
              label="Repite contraseña"
              type="password"
              valor={formulario.contrasena_confirmation}
              onChange={manejarCambio}
              error={errores.contrasena_confirmation}
              placeholder="••••••••"
              autoComplete="new-password"
            />

            <button type="submit" className="auth-btn" disabled={cargando}>
              {cargando ? 'Creando cuenta...' : 'Registrarse gratis →'}
            </button>
          </form>

          <p className="auth-footer">
            ¿Ya tienes cuenta?{' '}
            <Link to="/inicio-sesion">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}