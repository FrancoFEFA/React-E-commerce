/*
 * Componente Footer: pie de página transversal
 * Se renderiza en App.jsx abajo de Routes para aparecer en todas las vistas
 * Contiene links de navegación, contacto y redes (placeholders por ahora)
 */
import { Link } from 'react-router-dom';
import logo from '../assets/icon-verdu-colon.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Columna 1: logo + descripción */}
        <div className="footer-col">
          <div className="footer-brand">
            <img src={logo} alt="Verdulería Colón" className="footer-logo" />
            <span className="footer-title">Verdulería Colón</span>
          </div>
          <p className="footer-desc">
            Frutas y verduras frescas directo del campo a tu mesa.
          </p>
        </div>

        {/* Columna 2: navegación */}
        <div className="footer-col">
          <h3 className="footer-heading">Navegación</h3>
          <ul className="footer-links">
            <li><Link to="/" className="footer-link">Inicio</Link></li>
            <li><Link to="/productos" className="footer-link">Productos</Link></li>
            <li><Link to="/nosotros" className="footer-link">Nosotros</Link></li>
          </ul>
        </div>

        {/* Columna 3: contacto con placeholders */}
        <div className="footer-col">
          <h3 className="footer-heading">Contacto</h3>
          <p className="footer-contact-item">Tu dirección aquí</p>
          <p className="footer-contact-item">Tu teléfono aquí</p>
          <p className="footer-contact-item">Tu email aquí</p>
          <p className="footer-contact-item">Lun a Sáb de 8:00 a 20:00</p>
        </div>

        {/* Columna 4: redes sociales con placeholders */}
        <div className="footer-col">
          <h3 className="footer-heading">Seguinos</h3>
          <div className="footer-social">
            <a href="#" className="footer-social-link">Instagram</a>
            <a href="#" className="footer-social-link">Facebook</a>
            <a href="#" className="footer-social-link">WhatsApp</a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p className="footer-copyright">
          © {new Date().getFullYear()} Verdulería Colón. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;