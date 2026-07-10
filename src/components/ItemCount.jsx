/*
 * Componente presentacional: contador para seleccionar unidades de un producto
 * Permite incrementar y decrementar la cantidad entre 1 y el stock máximo
 * Los botones se deshabilitan visualmente al alcanzar los límites
 */
import { useState } from 'react';
import { useCart } from '../context/useCart';

const ItemCount = ({ product, stock, initial = 1, onAdd }) => {
  // Estado local para la cantidad seleccionada por el usuario
  const [count, setCount] = useState(initial);
  // Acceso al contexto del carrito para agregar items
  const { addItem } = useCart();

  /*
   * Incrementa el contador en 1, sin superar el stock máximo disponible
   */
  const incrementar = () => {
    if (count < stock) {
      setCount(count + 1);
    }
  };

  /*
   * Decrementa el contador en 1, sin bajar de 1 (mínimo una unidad)
   */
  const decrementar = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  return (
    <div className="item-count">
      {/* Etiqueta descriptiva */}
      <p className="item-count-label">Cantidad:</p>

      {/* Controles: botón de restar, cantidad actual, botón de sumar */}
      <div className="item-count-controls">
        {/* Botón para disminuir la cantidad, deshabilitado si count es 1 */}
        <button
          className="item-count-btn"
          onClick={decrementar}
          disabled={count <= 1}
        >
          −
        </button>

        {/* Cantidad actual seleccionada */}
        <span className="item-count-value">{count}</span>

        {/* Botón para aumentar la cantidad, deshabilitado si se alcanzó el stock */}
        <button
          className="item-count-btn"
          onClick={incrementar}
          disabled={count >= stock}
        >
          +
        </button>
      </div>

      {/*
        Botón para confirmar la acción:
        agrega el item al carrito via contexto y notifica al padre (ItemDetail)
        con la cantidad solicitada, para que cambie la vista
      */}
      <button
        className="item-count-add"
        onClick={() => {
          addItem(product, count);
          if (onAdd) onAdd(count);
        }}
      >
        Agregar al carrito
      </button>
    </div>
  );
};

export default ItemCount;
