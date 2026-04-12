import axios from 'axios'

const cliente = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Adjuntar token en cada petición si existe
cliente.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Redirigir al login si el token expira
cliente.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const urlPeticion = error.config.url;
    if (error.response?.status === 401 && !urlPeticion.includes('/inicio-sesion')) {
      localStorage.removeItem('token')
      window.location.href = '/inicio-sesion'
    }
    return Promise.reject(error)
  }
)

export default cliente
