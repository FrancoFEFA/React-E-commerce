// Componente de widget de carrito que muestra el icono y el contador
import { Link } from 'react-router-dom';
import { useCart } from '../../context/useCart';

const CartWidget = () => {
  // Obtiene la cantidad total de items desde el contexto del carrito
  const { totalQuantity } = useCart();

  return (
    <div className="cart-widget">
      <Link to="/cart" className="cart-icon-wrapper">
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
        {/* Indicador de cantidad total de productos en el carrito (solo si hay items) */}
        {totalQuantity > 0 && <span className="cart-badge">{totalQuantity}</span>}
      </Link>
    </div>
  );
};

export default CartWidget;
