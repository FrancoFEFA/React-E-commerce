/*
 * Componente contenedor del listado de productos
 * Consume el ProductsContext para obtener productos, categorías y estados
 * Usa useParams() para leer el parámetro :categoryId de la URL
 * En la ruta raíz muestra la sección de bienvenida + catálogo completo
 * En rutas de categoría filtra los productos correspondientes
 * Soporta paginación con botón "Cargar más" controlado por hasMore del contexto
 * El filtro local (selectedFilter) es estado de UI y queda local, no en contexto
 */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../context/useProducts';
import ItemList from './ItemList';
import CategoryFilter from './CategoryFilter';

const ItemListContainer = () => {
  // Filtro local de categoría en la vista de catálogo: es estado de UI, no compartido
  const [selectedFilter, setSelectedFilter] = useState('todas');
  // Término de búsqueda: filtra client-side por nombre (case-insensitive)
  const [searchTerm, setSearchTerm] = useState('');

  // Consumo del contexto del catálogo (incluye paginación)
  const {
    products,
    categories,
    loading,
    error,
    hasMore,
    getAllProducts,
    loadMoreProducts,
    getProductsByCategoryCached,
    loadMoreByCategory,
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

  /*
   * Handler del botón "Cargar más"
   * Delega al método del contexto según la vista activa (home o categoría)
   */
  const handleLoadMore = () => {
    if (categoryId) {
      loadMoreByCategory(categoryId);
    } else {
      loadMoreProducts();
    }
  };

  // Filtra por categoría (si hay filtro local activo) y por término de búsqueda
  let displayProducts = products;
  if (!categoryId && selectedFilter !== 'todas') {
    displayProducts = displayProducts.filter((product) =>
      product.category.includes(selectedFilter)
    );
  }
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase().trim();
    displayProducts = displayProducts.filter((product) =>
      product.name.toLowerCase().includes(term)
    );
  }

  /*
   * El botón "Cargar más" solo se muestra si hay más docs en el servidor,
   * no hay carga/error en curso, no hay filtro local ni búsqueda activa
   * (paginación server-side + filtros client-side mezclados son inconsistentes)
   */
  const showLoadMore =
    hasMore && !loading && !error && !searchTerm.trim() &&
    (categoryId || selectedFilter === 'todas');

  return (
    <div className="item-list-container">
      {/* Título del catálogo: se muestra en /productos, oculto en vista de categoría */}
      {!categoryId && (
        <div className="category-title">
          <h2>Todos los productos</h2>
        </div>
      )}

      {/* Barra de búsqueda: filtra productos por nombre client-side */}
      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar-input"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="search-bar-clear"
            onClick={() => setSearchTerm('')}
            type="button"
          >
            Borrar
          </button>
        )}
      </div>

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

      {/* Botón de paginación: cargar más productos desde el servidor */}
      {showLoadMore && (
        <div className="load-more-container">
          <button className="load-more-btn" onClick={handleLoadMore}>
            Cargar más productos
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemListContainer;