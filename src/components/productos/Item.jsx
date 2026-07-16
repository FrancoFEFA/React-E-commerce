/*
 * Componente presentacional: tarjeta individual de un producto en el catálogo
 * Muestra la imagen del producto, nombre, precio y un enlace al detalle
 * Usa <Link> de React Router para navegar a /item/:id sin recargar la página
 */
import { Link } from 'react-router-dom';

const Item = ({ product }) => {
  return (
    <div className="product-card">
      {/* Imagen del producto (base64 o URL) */}
      {product.image && (
        <img src={product.image} alt={product.name} className="product-image" />
      )}

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
