/*
 * Barra de navegación principal con logo, enlaces de categorías y carrito
 * Usa NavLink de React Router en lugar de <a> para navegación sin recarga
 * La clase .active se aplica automáticamente al enlace de la página actual
 */
import { Link, NavLink } from 'react-router-dom';
import CartWidget from "./CartWidget";
import logo from "../assets/logo.png";

const NavBar = () => {
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
          <li>
            <NavLink
              to="/category/frutas"
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              Frutas
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/category/verduras"
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              Verduras
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/category/lacteos"
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              Lácteos
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/category/bebidas"
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              Bebidas
            </NavLink>
          </li>
        </ul>

        {/* Widget del carrito dentro de la barra de navegación */}
        <CartWidget />
      </div>
    </nav>
  );
};

export default NavBar;
