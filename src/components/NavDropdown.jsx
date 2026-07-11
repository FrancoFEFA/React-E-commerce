/*
 * Componente NavDropdown: menú desplegable de Productos para el NavBar
 * Al hover muestra las opciones: Todos, Frutas, Verduras, Bebidas, Otros
 * Implementado con CSS hover (sin estado de React) para simplicidad
 */
import { Link } from 'react-router-dom';

// Opciones del dropdown: link + label visible
const OPTIONS = [
  { to: '/productos', label: 'Todos' },
  { to: '/productos/frutas', label: 'Frutas' },
  { to: '/productos/verduras', label: 'Verduras' },
  { to: '/productos/bebidas', label: 'Bebidas' },
  { to: '/productos/otros', label: 'Otros' },
];

const NavDropdown = () => {
  return (
    <div className="nav-dropdown">
      {/* Botón visible del dropdown */}
      <Link to="/productos" className="nav-dropdown-trigger">
        Productos
        <span className="nav-dropdown-arrow">▾</span>
      </Link>

      {/* Menú desplegable: se muestra al hover del trigger */}
      <ul className="nav-dropdown-menu">
        {OPTIONS.map((opt) => (
          <li key={opt.to}>
            <Link to={opt.to} className="nav-dropdown-item">
              {opt.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavDropdown;