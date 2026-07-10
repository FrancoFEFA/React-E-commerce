/*
 * Componente presentacional: vista completa de un producto individual
 * Muestra el emoji grande, nombre, descripción, precio y stock disponible
 * Incluye el componente ItemCount para seleccionar cantidad a agregar al carrito
 * Cuando el usuario confirma una cantidad, el ItemCount se reemplaza por un
 * botón "Terminar mi compra" que lleva al carrito
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ItemCount from './ItemCount';

const ItemDetail = ({ product }) => {
  // Estado interno: cantidad de items solicitados (0 = aún no se agregó nada)
  const [addedQuantity, setAddedQuantity] = useState(0);

  /*
   * Callback que ItemCount ejecuta al confirmar "Agregar al carrito"
   * Guarda la cantidad solicitada para cambiar la vista
   */
  const handleAdd = (quantity) => {
    setAddedQuantity(quantity);
  };

  return (
    <div className="product-detail">
      {/* Sección izquierda: emoji grande del producto */}
      <div className="product-detail-image">
        <span>{product.image}</span>
      </div>

      {/* Sección derecha: información textual y contador de cantidad */}
      <div className="product-detail-info">
        {/* Nombre del producto */}
        <h1 className="product-detail-name">{product.name}</h1>

        {/* Descripción detallada */}
        <p className="product-detail-description">{product.description}</p>

        {/* Precio del producto */}
        <p className="product-detail-price">${product.price}</p>

        {/* Stock disponible en inventario */}
        <p className="product-detail-stock">
          Stock disponible: {product.stock} unidades
        </p>

        {/*
          Renderizado condicional:
          - Si aún no se solicitó cantidad (addedQuantity === 0) muestra ItemCount
          - Si ya se solicitó, muestra el botón "Terminar mi compra"
        */}
        {addedQuantity === 0 ? (
          <ItemCount
            product={product}
            stock={product.stock}
            initial={1}
            onAdd={handleAdd}
          />
        ) : (
          <Link to="/cart" className="item-detail-checkout-btn">
            Terminar mi compra
          </Link>
        )}
      </div>
    </div>
  );
};

export default ItemDetail;
