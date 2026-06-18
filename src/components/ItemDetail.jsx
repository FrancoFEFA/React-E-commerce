/*
 * Componente presentacional: vista completa de un producto individual
 * Muestra el emoji grande, nombre, descripción, precio y stock disponible
 * Incluye el componente ItemCount para seleccionar cantidad a agregar al carrito
 */
import ItemCount from './ItemCount';

const ItemDetail = ({ product }) => {
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

        {/* Contador para seleccionar cantidad, se integrará con el carrito */}
        <ItemCount stock={product.stock} initial={1} />
      </div>
    </div>
  );
};

export default ItemDetail;
