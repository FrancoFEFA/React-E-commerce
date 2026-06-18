/*
 * Componente presentacional: recibe un array de productos y los renderiza en grilla
 * Usa Array.map() para iterar sobre cada producto del catálogo
 * Cada Item recibe una key única (product.id) requerida por React para listas
 */
import Item from './Item';

const ItemList = ({ products }) => {
  return (
    <div className="products-grid">
      {/* Itera sobre el array de productos y renderiza un Item por cada uno */}
      {products.map((product) => (
        <Item key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ItemList;
