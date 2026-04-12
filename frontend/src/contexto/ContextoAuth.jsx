import { createContext, useContext, useState, useEffect } from 'react'
import cliente from '../api/cliente'

const ContextoAuth = createContext(null)

export function ProveedorAuth({ children }) {
  const [usuario,  setUsuario]  = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      cliente.get('/perfil')
        .then(res => setUsuario(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setCargando(false))
    } else {
      setCargando(false)
    }
  }, [])

  const iniciarSesion = async (email, contrasena) => {
    try{
      const res = await cliente.post('/inicio-sesion', { email, contrasena })
      localStorage.setItem('token', res.data.token)
      setUsuario(res.data.usuario)
      return res.data.usuario
    }catch (error){
      throw error;
    }
  }

  const registrar = async (nombre, email, contrasena, contrasena_confirmation) => {
    const res = await cliente.post('/registro', { nombre, email, contrasena, contrasena_confirmation })
    localStorage.setItem('token', res.data.token)
    setUsuario(res.data.usuario)
    return res.data.usuario
  }

  const cerrarSesion = async () => {
    await cliente.post('/cerrar-sesion').catch(() => {})
    localStorage.removeItem('token')
    setUsuario(null)
  }

  return (
    <ContextoAuth.Provider value={{ usuario, cargando, iniciarSesion, registrar, cerrarSesion }}>
      {children}
    </ContextoAuth.Provider>
  )
}

export const useAuth = () => useContext(ContextoAuth)
