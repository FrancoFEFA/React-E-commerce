/*
 * Componente ProtectedRoute: wrapper de rutas que requieren autenticación
 * - Si loading: muestra estado de carga (onAuthStateChanged aún no resolvió)
 * - Si !user: redirige a /login
 * - Si requireAdmin && !isAdmin: muestra mensaje de acceso restringido
 * - Si pasa las validaciones: renderiza children
 */
import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/useUser';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useUser();

  // Estado de carga: el listener de auth aún no resolvió
  if (loading) {
    return (
      <div className="status-container">
        <p className="loading-text">Cargando...</p>
      </div>
    );
  }

  // No hay usuario logueado: redirige al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se requiere admin pero el user no lo es: acceso restringido
  if (requireAdmin && !user.isAdmin) {
    return (
      <div className="status-container">
        <p className="error-text">Acceso restringido. Se requieren permisos de administrador.</p>
      </div>
    );
  }

  // Validaciones ok: renderiza el contenido protegido
  return children;
};

export default ProtectedRoute;