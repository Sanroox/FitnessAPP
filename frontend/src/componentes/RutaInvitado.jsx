import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexto/ContextoAuth';

export default function RutaInvitado({ children }) {
  const { usuario, cargando } = useAuth();

  // Mientras comprobamos el token, no pintamos nada (o pon un spinner)
  if (cargando) return <div>Cargando...</div>;

  // Si ya hay un usuario logueado, le prohibimos ver esta página y lo mandamos a la raíz
  if (usuario) {
    return <Navigate to="/" replace />;
  }

  // Si no hay usuario, le dejamos ver el componente (Login o Registro)
  return children;
}