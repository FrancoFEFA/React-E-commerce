/*
 * Contexto del catálogo de productos
 * Centraliza el acceso a productos y categorías con sistema de caché
 * Evita refetcheos innecesarios al navegar entre categorías ya visitadas
 * Única fuente de verdad para categorías (NavBar e ItemListContainer consumen de aquí)
 */
import { createContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  getProducts,
  getProductsByCategory,
  getCategories,
  getProductById,
} from '../data/products';

// Creación del contexto del catálogo
const ProductsContext = createContext();

/*
 * Provider que envuelve la aplicación y expone el catálogo y sus métodos
 * Mantiene caché en refs (no disparan re-render) y estado reactivo para UI
 */
export const ProductsProvider = ({ children }) => {
  // Estado reactivo consumido por los componentes
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /*
   * Caché en refs: no disparan re-render al mutarse
   * - cacheAll: array completo de productos | null
   * - cacheByCategory: objeto { categoryId: [productos] }
   * - cacheById: objeto { itemId: producto }
   */
  const cacheAll = useRef(null);
  const cacheByCategory = useRef({});
  const cacheById = useRef({});

  /*
   * Al montar el provider carga las categorías una sola vez
   * Son la única fuente de verdad compartida por NavBar e ItemListContainer
   */
  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  /*
   * Devuelve todos los productos
   * Si ya están en caché, los setea sin llamar a la promesa (instantáneo)
   * Si no, llama a getProducts(), los cachea y actualiza el estado
   * useCallback: identidad estable para no re-disparar efectos consumidores
   */
  const getAllProducts = useCallback(() => {
    // Hit de caché: no hay fetch, no hay loading
    if (cacheAll.current) {
      setProducts(cacheAll.current);
      setError(null);
      setLoading(false);
      return;
    }

    // Miss de caché: dispara la promesa
    setLoading(true);
    getProducts()
      .then((data) => {
        cacheAll.current = data;
        setProducts(data);
        setError(null);
      })
      .catch((err) => {
        setProducts([]);
        setError('Ocurrió un error al cargar los productos.');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  /*
   * Devuelve los productos filtrados por categoría
   * Cachea por categoría: una categoría ya vista se sirve instantáneamente
   * Si la categoría no tiene productos, setea error
   * useCallback: identidad estable para no re-disparar efectos consumidores
   */
  const getProductsByCategoryCached = useCallback((categoryId) => {
    // Hit de caché: la categoría ya fue cargada antes
    if (cacheByCategory.current[categoryId]) {
      const cached = cacheByCategory.current[categoryId];
      setProducts(cached);
      // Categoría sin productos: se marca como error para avisar al usuario
      if (cached.length === 0) {
        setError(
          `No se encontraron productos para la categoría "${categoryId}".`
        );
      } else {
        setError(null);
      }
      setLoading(false);
      return;
    }

    // Miss de caché: dispara la promesa y cachea el resultado
    setLoading(true);
    getProductsByCategory(categoryId)
      .then((data) => {
        cacheByCategory.current[categoryId] = data;
        setProducts(data);
        if (data.length === 0) {
          setError(
            `No se encontraron productos para la categoría "${categoryId}".`
          );
        } else {
          setError(null);
        }
      })
      .catch((err) => {
        setProducts([]);
        setError('Ocurrió un error al cargar los productos.');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  /*
   * Devuelve una Promise con un producto por su id
   * Mantiene la firma de promesa para que ItemDetailContainer conserve su
   * lógica de race condition (bandera cancelled)
   * Si está en caché, resuelve inmediatamente sin llamar a la promesa
   * useCallback: identidad estable para no re-disparar efectos consumidores
   */
  const getProductByIdCached = useCallback((itemId) => {
    const key = parseInt(itemId);

    // Hit de caché: resuelve instantáneo con el producto cacheado
    if (cacheById.current[key]) {
      return Promise.resolve(cacheById.current[key]);
    }

    // Miss de caché: llama a la promesa y cachea el resultado
    return getProductById(itemId).then((data) => {
      if (data) {
        cacheById.current[data.id] = data;
      }
      return data;
    });
  }, []);

  /*
   * Value expuesto a los consumidores del contexto
   * useMemo: el objeto value solo se recrea cuando cambian los estados reactivos
   * Las funciones useCallback son estables, así que el value cambia solo
   * cuando products/categories/loading/error cambian
   */
  const value = useMemo(
    () => ({
      products,
      categories,
      loading,
      error,
      getAllProducts,
      getProductsByCategoryCached,
      getProductByIdCached,
    }),
    [products, categories, loading, error, getAllProducts, getProductsByCategoryCached, getProductByIdCached]
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsContext;