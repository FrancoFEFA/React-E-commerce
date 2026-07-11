/*
 * Componente contenedor del listado de productos
 * Consume el ProductsContext para obtener productos, categorías y estados
 * Usa useParams() para leer el parámetro :categoryId de la URL
 * En la ruta raíz muestra la sección de bienvenida + catálogo completo
 * En rutas de categoría filtra los productos correspondientes
 * El filtro local (selectedFilter) es estado de UI y queda local, no en contexto
 */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../context/useProducts';
import ItemList from './ItemList';
import CategoryFilter from './CategoryFilter';

const ItemListContainer = ({ greeting }) => {
  // Filtro local de categoría en la ruta raíz: es estado de UI, no compartido
  const [selectedFilter, setSelectedFilter] = useState('todas');

  // Consumo del contexto del catálogo
  const {
    products,
    categories,
    loading,
    error,
    getAllProducts,
    getProductsByCategoryCached,
  } = useProducts();

  // Extrae el parámetro categoryId de la URL (undefined en la ruta raíz)
  const { categoryId } = useParams();

  /*
   * Efecto que se ejecuta cada vez que cambia categoryId en la URL
   * Delega la lógica de fetch y caché al contexto
   * Solo decide qué método del contexto invocar según haya o no categoría
   */
  useEffect(() => {
    if (categoryId) {
      getProductsByCategoryCached(categoryId);
    } else {
      getAllProducts();
    }
  }, [categoryId, getAllProducts, getProductsByCategoryCached]);

  // En la ruta raíz, si hay un filtro seleccionado, se aplica localmente
  const displayProducts =
    !categoryId && selectedFilter !== 'todas'
      ? products.filter((product) => product.category.includes(selectedFilter))
      : products;

  return (
    <div className="item-list-container">
      {/* Sección de bienvenida: solo se muestra en la ruta raíz */}
      {greeting && !categoryId && (
        <div className="welcome-section">
          <div className="welcome-icon">ImgEj</div>
          <h1 className="welcome-title">{greeting}</h1>
          <p className="welcome-subtitle">
            Frutas y verduras frescas directo del campo a tu mesa. Calidad,
            frescura y los mejores precios todos los días.
          </p>
        </div>
      )}

      {/* Filtro local de categorías: solo en la ruta raíz */}
      {!categoryId && !loading && !error && categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selected={selectedFilter}
          onSelect={setSelectedFilter}
        />
      )}

      {/* Título de categoría: se muestra al navegar por una categoría específica */}
      {categoryId && !loading && !error && (
        <div className="category-title">
          <h2>{categoryId}</h2>
        </div>
      )}

      {/* Estado de carga: mensaje mientras se resuelve la promesa */}
      {loading && (
        <div className="status-container">
          <p className="loading-text">Cargando productos...</p>
        </div>
      )}

      {/* Estado de error: mensaje si la categoría no existe o falla la carga */}
      {error && !loading && (
        <div className="status-container">
          <p className="error-text">{error}</p>
        </div>
      )}

      {/* Éxito: renderiza la grilla de productos usando el componente presentacional */}
      {!loading && !error && <ItemList products={displayProducts} />}
    </div>
  );
};

export default ItemListContainer;
