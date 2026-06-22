/*
 * Componente contenedor del listado de productos
 * Maneja el estado, los efectos secundarios y las llamadas asíncronas
 * Usa useParams() para leer el parámetro :categoryId de la URL
 * En la ruta raíz muestra la sección de bienvenida + catálogo completo
 * En rutas de categoría filtra los productos correspondientes
 */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProducts, getProductsByCategory, getCategories } from '../data/products';
import ItemList from './ItemList';
import CategoryFilter from './CategoryFilter';

const ItemListContainer = ({ greeting }) => {
  // Estado para almacenar los productos obtenidos de la promesa
  const [products, setProducts] = useState([]);
  // Estado de carga: true mientras la promesa no se resuelve
  const [loading, setLoading] = useState(true);
  // Estado de error para categorías inexistentes o fallos de la promesa
  const [error, setError] = useState(null);
  // Estado para el filtro local de categorías en la ruta raíz
  const [selectedFilter, setSelectedFilter] = useState('todas');
  // Estado con las categorías disponibles para el filtro de inicio
  const [categories, setCategories] = useState([]);

  // Extrae el parámetro categoryId de la URL (undefined en la ruta raíz)
  const { categoryId } = useParams();

  /*
   * Efecto que se ejecuta cada vez que cambia categoryId en la URL
   * categoryId en el array de dependencias asegura que se actualice al navegar
   *
   * La bandera cancelled previene una race condition (condición de carrera):
   * si el usuario cambia de categoría antes de que termine el setTimeout,
   * la respuesta de la primera promesa se ignora y no pisa el estado nuevo.
   */
  useEffect(() => {
    let cancelled = false;

    if (categoryId) {
      // Si hay categoría en la URL, filtra productos por esa categoría
      getProductsByCategory(categoryId)
        .then((data) => {
          if (cancelled) return;
          // Si el array está vacío, la categoría no tiene productos
          if (data.length === 0) {
            setProducts([]);
            setError(
              `No se encontraron productos para la categoría "${categoryId}".`
            );
          } else {
            setProducts(data);
            setError(null);
          }
        })
        .catch((err) => {
          if (cancelled) return;
          setProducts([]);
          setError('Ocurrió un error al cargar los productos.');
          console.error(err);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    } else {
      // Si no hay categoría (ruta raíz), carga todos los productos
      getProducts()
        .then((data) => {
          if (cancelled) return;
          setProducts(data);
          setError(null);
        })
        .catch((err) => {
          if (cancelled) return;
          setProducts([]);
          setError('Ocurrió un error al cargar los productos.');
          console.error(err);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }

    /*
     * Cleanup del efecto: se ejecuta antes de que el efecto se vuelva a correr
     * o cuando el componente se desmonta. Al poner cancelled = true evitamos una
     * race condition: si el usuario navega a otra categoría antes de que la
     * promesa responda, la promesa vieja no sobrescribirá el nuevo listado.
     */
    return () => {
      cancelled = true;
    };
  }, [categoryId]); // Dependencia: se re-ejecuta al cambiar la categoría

  /*
   * Efecto que carga las categorías disponibles solo en la ruta raíz
   * Se usa para renderizar el filtro local del inicio
   */
  useEffect(() => {
    let cancelled = false;

    if (!categoryId) {
      getCategories()
        .then((data) => {
          if (!cancelled) setCategories(data);
        })
        .catch((err) => console.error(err));
    }

    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  // En la ruta raíz, si hay un filtro seleccionado, se aplica localmente
  const displayProducts =
    !categoryId && selectedFilter !== 'todas'
      ? products.filter((product) => product.category === selectedFilter)
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
