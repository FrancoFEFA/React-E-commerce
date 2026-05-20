// Componente de navegación principal con logo, enlaces y carrito
import CartWidget from "./CartWidget";
import logo from "../assets/logo.png";

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo de la tienda */}
        <a href="/" className="navbar-brand">
          <img src={logo} alt="Verdulería Fresh Logo" className="navbar-logo" />
          <span className="navbar-title">Verdulería Fresh</span>
        </a>

        {/* Navegación por categorías de productos */}
        <ul className="navbar-links">
          <li>
            <a href="/categoria/frutas" className="nav-link">
              Frutas
            </a>
          </li>
          <li>
            <a href="/categoria/verduras" className="nav-link">
              Verduras
            </a>
          </li>
          <li>
            <a href="/categoria/lacteos" className="nav-link">
              Lácteos
            </a>
          </li>
          <li>
            <a href="/categoria/bebidas" className="nav-link">
              Bebidas
            </a>
          </li>
          <li>
            <a href="/categoria/ofertas" className="nav-link">
              Ofertas
            </a>
          </li>
        </ul>

        {/* Widget del carrito dentro de la barra de navegación */}
        <CartWidget />
      </div>
    </nav>
  );
};

export default NavBar;
