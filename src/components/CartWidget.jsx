// Componente de widget de carrito que muestra el icono y el contador
const CartWidget = () => {
  return (
    <div className="cart-widget">
      <div className="cart-icon-wrapper">
        {/* Icono del carrito de compras */}
        <svg
          className="cart-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {/* Indicador de cantidad de productos en el carrito */}
        <span className="cart-badge">0</span>
      </div>
    </div>
  );
};

export default CartWidget;
