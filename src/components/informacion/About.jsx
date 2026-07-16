/*
 * Componente About: página "Nosotros"
 * Cuenta la historia, misión y valores de la verdulería
 * Info de contacto con placeholders para reemplazar después
 */
import { Link } from 'react-router-dom';
import hero from '../../assets/Nosotros-hero.png';

const About = () => {
  return (
    <div className="about">
      {/* Sección principal: título e imagen */}
      <section className="about-hero">
        <h1 className="about-title">Sobre Nosotros</h1>
        <img src={hero} alt="Verdulería Colón" className="about-img" />
      </section>

      {/* Historia */}
      <section className="about-section">
        <h2 className="about-section-title">Nuestra historia</h2>
        <p className="about-text">
          Verdulería Colón nació con la idea de llevar frutas y verduras frescas
          directamente del campo a tu mesa. Desde nuestros comienzos, trabajamos
          con productores locales para garantizar la máxima calidad y frescura
          en cada producto que ofrecemos.
        </p>
      </section>

      {/* Misión y valores */}
      <section className="about-section">
        <h2 className="about-section-title">Misión y valores</h2>
        <div className="about-values">
          <div className="about-value-card">
            <span className="about-value-emoji">🌱</span>
            <h3 className="about-value-title">Frescura</h3>
            <p className="about-value-text">
              Seleccionamos cada producto en su punto óptimo de maduración.
            </p>
          </div>
          <div className="about-value-card">
            <span className="about-value-emoji">🤝</span>
            <h3 className="about-value-title">Confianza</h3>
            <p className="about-value-text">
              Trabajamos con productores de confianza y procesos transparentes.
            </p>
          </div>
          <div className="about-value-card">
            <span className="about-value-emoji">🚚</span>
            <h3 className="about-value-title">Delivery</h3>
            <p className="about-value-text">
              Llevamos tu pedido a la puerta de tu casa, fresco y a tiempo.
            </p>
          </div>
        </div>
      </section>

      {/* Contacto con placeholders */}
      <section className="about-section">
        <h2 className="about-section-title">Contacto</h2>
        <div className="about-contact">
          <p className="about-contact-item">
            <strong>Dirección:</strong> Tu dirección aquí
          </p>
          <p className="about-contact-item">
            <strong>Teléfono:</strong> Tu teléfono aquí
          </p>
          <p className="about-contact-item">
            <strong>Email:</strong> Tu email aquí
          </p>
          <p className="about-contact-item">
            <strong>Horarios:</strong> Lun a Sáb de 8:00 a 20:00
          </p>
        </div>
      </section>

      {/* CTA para volver al catálogo */}
      <div className="about-cta">
        <Link to="/productos" className="about-cta-btn">
          Ver productos
        </Link>
      </div>
    </div>
  );
};

export default About;