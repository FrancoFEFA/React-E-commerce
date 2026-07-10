/*
 * Componente Cart: vista del carrito de compras
 * Muestra el desglose de los items agregados, agrupados por producto
 * Por cada item muestra cantidad, subtotal y un control para eliminarlo
 * Calcula y muestra el precio total de la compra
 * Si el carrito está vacío, muestra un mensaje y un link para volver al catálogo
 */
import { Link } from 'react-router-dom';
import { useCart } from '../context/useCart';

const Cart = () => {
  // Consumo del contexto del carrito
  const { cart, removeItem, clear, totalQuantity, totalPrice } = useCart();

  // Estado vacío: no hay items en el carrito
  if (totalQuantity === 0) {
    return (
      <div className="cart cart-empty">
        <h2 className="cart-title">Tu carrito está vacío</h2>
        <p className="cart-empty-text">
          No hay productos en tu carrito todavía.
        </p>
        <Link to="/" className="cart-empty-btn">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  // Estado con items: desglose de la compra
  return (
    <div className="cart">
      <h2 className="cart-title">Tu carrito</h2>

      {/* Listado de items agrupados por producto */}
      <ul className="cart-list">
        {cart.map((item) => (
          <li key={item.id} className="cart-item">
            {/* Imagen (emoji) y nombre del producto */}
            <span className="cart-item-image">{item.image}</span>
            <div className="cart-item-info">
              <h3 className="cart-item-name">{item.name}</h3>
              <p className="cart-item-price">${item.price} c/u</p>
            </div>

            {/* Cantidad seleccionada */}
            <div className="cart-item-quantity">
              <span className="cart-item-quantity-label">Cantidad:</span>
              <span className="cart-item-quantity-value">{item.quantity}</span>
            </div>

            {/* Subtotal de este item (precio * cantidad) */}
            <div className="cart-item-subtotal">
              <span className="cart-item-subtotal-label">Subtotal:</span>
              <span className="cart-item-subtotal-value">
                ${item.price * item.quantity}
              </span>
            </div>

            {/* Control para eliminar este item del carrito */}
            <button
              className="cart-item-remove"
              onClick={() => removeItem(item.id)}
              title={`Eliminar ${item.name} del carrito`}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {/* Desglose del total de la compra */}
      <div className="cart-summary">
        <p className="cart-summary-quantity">
          Total de unidades: <strong>{totalQuantity}</strong>
        </p>
        <p className="cart-summary-total">
          Precio total: <strong>${totalPrice}</strong>
        </p>
      </div>

      {/* Acciones: vaciar carrito o seguir comprando */}
      <div className="cart-actions">
        <button className="cart-clear-btn" onClick={clear}>
          Vaciar carrito
        </button>
        <Link to="/" className="cart-continue-btn">
          Seguir comprando
        </Link>
      </div>
    </div>
  );
};

export default Cart;