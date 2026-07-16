/*
 * Barra de navegación principal con logo, enlaces de categorías y carrito
 * Usa NavLink de React Router en lugar de <a> para navegación sin recarga
 * La clase .active se aplica automáticamente al enlace de la página actual
 */
import { Link, useNavigate, useLocation } from 'react-router-dom';
import CartWidget from "./CartWidget";
import NavDropdown from "./NavDropdown";
import logo from "../../assets/icon-verdu-colon.png";
import { useUser } from '../../context/useUser';

const NavBar = () => {
  // Estado del usuario desde el contexto de auth
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * Cierra sesión y redirige al inicio
   * onAuthStateChanged del UserContext se encarga de setear user en null
   */
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleLinkClick = (to) => () => {
    if (location.pathname === to) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo de la tienda: redirige al inicio usando Link de React Router */}
        <Link to="/" className="navbar-brand" onClick={handleLinkClick('/')}>
          <img src={logo} alt="Verdulería Colón Logo" className="navbar-logo" />
          <span className="navbar-title">Verdulería Colón</span>
        </Link>

        {/* Menú de navegación: link Nosotros + dropdown Productos */}
        <ul className="navbar-links">
          {/* Link a la sección Nosotros */}
          <li>
            <Link to="/nosotros" className="nav-link" onClick={handleLinkClick('/nosotros')}>
              Nosotros
            </Link>
          </li>
        </ul>

        {/* Dropdown de Productos con sub-links a categorías */}
        <NavDropdown />

        {/* Sección de usuario: login/logout/admin según estado de auth */}
        <div className="navbar-user">
          {/* Si no hay user logueado: botón para iniciar sesión */}
          {!user && (
            <Link to="/login" className="navbar-login-btn">
              Iniciar sesión
            </Link>
          )}

          {/* Si hay user logueado: saludo + acciones */}
          {user && (
            <>
              {/* Saludo con el nombre del usuario */}
              <span className="navbar-user-greeting">
                Hola, {user.displayName || user.email}
              </span>

              {/* Links admin: solo visibles si el user es admin */}
              {user.isAdmin && (
                <>
                  <Link to="/admin/productos" className="navbar-admin-btn">
                    Administrar
                  </Link>
                  <Link to="/admin/create-product" className="navbar-admin-btn">
                    Publicar
                  </Link>
                </>
              )}

              {/* Botón para cerrar sesión */}
              <button onClick={handleLogout} className="navbar-logout-btn">
                Cerrar sesión
              </button>
            </>
          )}
        </div>

        {/* Widget del carrito dentro de la barra de navegación */}
        <CartWidget />
      </div>
    </nav>
  );
};

export default NavBar;
