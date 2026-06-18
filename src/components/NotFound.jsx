/*
 * Componente de página no encontrada (error 404)
 * Se muestra cuando el usuario navega a una ruta que no existe
 * Ofrece un enlace para volver al inicio de la aplicación
 */
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found">
      {/* Emoji indicativo de búsqueda sin resultados */}
      <span className="not-found-icon">🔍</span>

      {/* Código de error HTTP 404 */}
      <h1 className="not-found-code">404</h1>

      {/* Mensaje descriptivo para el usuario */}
      <h2 className="not-found-title">Página no encontrada</h2>
      <p className="not-found-message">
        La ruta que buscas no existe o fue movida.
      </p>

      {/* Enlace para regresar al catálogo principal */}
      <Link to="/" className="not-found-link">
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;
