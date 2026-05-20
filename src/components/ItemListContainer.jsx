// Componente que muestra el saludo principal y las ventajas del servicio
const ItemListContainer = ({ greeting }) => {
  return (
    <div className="item-list-container">
      <div className="welcome-section">
        {/* Icono decorativo de bienvenida */}
        <div className="welcome-icon">Prox Icon</div>
        <h1 className="welcome-title">{greeting}</h1>
        <p className="welcome-subtitle">
          Frutas y verduras frescas directo del campo a tu mesa. Calidad,
          frescura y los mejores precios todos los días.
        </p>
        {/* Tarjetas con beneficios destacados */}
        <div className="welcome-features">
          <div className="feature-card">
            <span className="feature-icon">Prox Icon</span>
            <h3>Envío Gratis</h3>
            <p>En compras mayores a $5.000</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">Prox Icon</span>
            <h3>100% Frescos</h3>
            <p>Productos del día seleccionados</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">Prox Icon</span>
            <h3>Mejores Precios</h3>
            <p>Ofertas exclusivas online</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemListContainer;
