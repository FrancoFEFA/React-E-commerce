/*
 * Componente presentacional: tarjeta individual de un producto en el catálogo
 * Muestra el emoji del producto, nombre, precio y un enlace al detalle
 * Usa <Link> de React Router para navegar a /item/:id sin recargar la página
 */
import { Link } from 'react-router-dom';

const Item = ({ product }) => {
  return (
    <div className="product-card">
      {/* Emoji representativo del producto */}
      <span className="product-emoji">{product.image}</span>

      {/* Nombre del producto */}
      <h3 className="product-name">{product.name}</h3>

      {/* Precio formateado en pesos */}
      <p className="product-price">${product.price}</p>

      {/* Enlace a la vista de detalle del producto usando su id */}
      <Link to={`/item/${product.id}`} className="product-link">
        Ver detalle
      </Link>
    </div>
  );
};

export default Item;
