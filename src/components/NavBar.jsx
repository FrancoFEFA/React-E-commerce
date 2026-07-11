/*
 * Barra de navegación principal con logo, enlaces de categorías y carrito
 * Usa NavLink de React Router en lugar de <a> para navegación sin recarga
 * La clase .active se aplica automáticamente al enlace de la página actual
 */
import { Link, NavLink, useNavigate } from 'react-router-dom';
import CartWidget from "./CartWidget";
import logo from "../assets/logo.png";
import { useProducts } from '../context/useProducts';
import { useUser } from '../context/useUser';

const NavBar = () => {
  // Categorías desde el contexto: única fuente de verdad para NavBar y filtros
  const { categories } = useProducts();
  // Estado del usuario desde el contexto de auth
  const { user, logout } = useUser();
  const navigate = useNavigate();

  /*
   * Cierra sesión y redirige al inicio
   * onAuthStateChanged del UserContext se encarga de setear user en null
   */
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo de la tienda: redirige al inicio usando Link de React Router */}
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="Verdulería Fresh Logo" className="navbar-logo" />
          <span className="navbar-title">Verdulería Fresh</span>
        </Link>

        {/* Menú de navegación con NavLink a cada categoría */}
        <ul className="navbar-links">
          {categories.map((category) => (
            <li key={category}>
              <NavLink
                to={`/category/${category}`}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </NavLink>
            </li>
          ))}
        </ul>

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

              {/* Link para publicar productos: solo visible si es admin */}
              {user.isAdmin && (
                <Link to="/admin/create-product" className="navbar-admin-btn">
                  Publicar producto
                </Link>
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
