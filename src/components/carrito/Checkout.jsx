/*
 * Componente Checkout: formulario de datos del comprador y confirmación de la orden
 * Pide nombre, teléfono, dirección de delivery y horario preferido
 * Al confirmar: persiste la orden en Firestore (createOrder) y vacía el carrito
 * Muestra el ID de la orden generada tras el éxito
 * Requiere用户 logueado (wrappado por ProtectedRoute)
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/useCart';
import { useUser } from '../../context/useUser';
import { createOrder } from '../../services/firebase/ordersService';

const Checkout = () => {
  // Datos del comprador
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [schedule, setSchedule] = useState('');

  // Estado de UI
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const { cart, totalPrice, clear } = useCart();
  const { user } = useUser();

  /*
   * Maneja el submit: valida el carrito, crea la orden en Firestore y vacía el carrito
   * Muestra el ID de la orden generada para confirmar la compra
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const id = await createOrder({
        items: cart,
        total: totalPrice,
        buyer: { name, phone, address, schedule },
        userId: user.uid,
      });

      setOrderId(id);
      clear();
    } catch (err) {
      setErrorMsg('Ocurrió un error al procesar la compra.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Pantalla de confirmación: la orden se creó con éxito
  if (orderId) {
    return (
      <div className="checkout-container">
        <div className="checkout-success">
          <h2 className="checkout-success-title">¡Compra confirmada!</h2>
          <p className="checkout-success-text">
            Tu orden fue registrada correctamente.
          </p>
          <p className="checkout-success-order">
            ID de orden: <strong>{orderId}</strong>
          </p>
          <Link to="/" className="checkout-success-btn">
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  // Si el carrito está vacío no tiene sentido hacer checkout
  if (cart.length === 0 && !orderId) {
    return (
      <div className="checkout-container">
        <div className="checkout-empty">
          <h2 className="checkout-empty-title">No hay productos para comprar</h2>
          <p className="checkout-empty-text">
            Tu carrito está vacío. Agregá productos antes de finalizar la compra.
          </p>
          <Link to="/" className="checkout-empty-btn">
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  // Formulario de checkout
  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Finalizar compra</h2>

      {/* Resumen del carrito */}
      <div className="checkout-summary">
        <h3 className="checkout-summary-title">Resumen de tu compra</h3>
        <ul className="checkout-summary-list">
          {cart.map((item) => (
            <li key={item.id} className="checkout-summary-item">
              <span className="checkout-summary-name">
                {item.image && (
                  <img src={item.image} alt={item.name} className="checkout-summary-img" />
                )}
                {item.name} × {item.quantity}
              </span>
              <span className="checkout-summary-subtotal">
                ${item.price * item.quantity}
              </span>
            </li>
          ))}
        </ul>
        <p className="checkout-summary-total">
          Total: <strong>${totalPrice}</strong>
        </p>
      </div>

      {/* Mensaje de error si falla */}
      {errorMsg && <p className="checkout-error">{errorMsg}</p>}

      {/* Formulario de datos del comprador */}
      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label className="form-label">Nombre completo</label>
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Tu nombre"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Teléfono</label>
          <input
            type="tel"
            className="form-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="Ej: 11 1234-5678"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Dirección de entrega</label>
          <input
            type="text"
            className="form-input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="Ej: Av. Siempre Viva 742"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Horario preferido</label>
          <select
            className="form-input"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            required
          >
            <option value="">Seleccionar horario</option>
            <option value="mañana">Mañana (9-12hs)</option>
            <option value="mediodia">Mediodía (12-15hs)</option>
            <option value="tarde">Tarde (15-18hs)</option>
            <option value="noche">Noche (18-21hs)</option>
          </select>
        </div>

        <button
          type="submit"
          className="checkout-submit-btn"
          disabled={submitting}
        >
          {submitting ? 'Procesando compra...' : 'Confirmar compra'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;