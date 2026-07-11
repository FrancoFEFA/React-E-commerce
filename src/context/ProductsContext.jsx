/*
 * Contexto del catálogo de productos
 * Centraliza el acceso a productos y categorías con sistema de caché y paginación
 * Evita refetcheos innecesarios al navegar entre categorías ya visitadas
 * Única fuente de verdad para categorías (NavBar e ItemListContainer consumen de aquí)
 *
 * Paginación con cursor (startAfter): controlada por hasMore y lastDoc
 * - getAllProducts(reset): carga primera página (o resetea caché tras crear producto)
 * - loadMoreProducts(): carga siguiente página concatenando al estado
 * - getProductsByCategoryCached / loadMoreByCategory: idem por categoría
 */
import { createContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  getProducts,
  getProductsByCategory,
  getCategories,
  getProductById,
} from '../services/firebase/productsService';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  // Estado reactivo consumido por los componentes
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  /*
   * Caché y cursores en refs: no disparan re-render
   * - cacheAll: array acumulado de productos cargados hasta ahora | null
   * - cacheByCategory: { categoryId: { products: [], lastDoc } }
   * - cacheById: { itemId: producto } (lookup por id, sin paginación)
   * - lastDocAll / lastDocByCategory: cursores para paginación con startAfter
   */
  const cacheAll = useRef(null);
  const cacheByCategory = useRef({});
  const cacheById = useRef({});
  const lastDocAll = useRef(null);
  const lastDocByCategory = useRef({});
  // categoría activa para saber a qué caché Junior aplicar loadMore
  const activeCategory = useRef(null);

  /*
   * Al montar el provider carga las categorías una sola vez
   * Única fuente de verdad compartida por NavBar e ItemListContainer
   */
  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  /*
   * Carga la primera página de productos (o resetea el caché si reset=true)
   * reset=true se usa cuando el admin publica un producto nuevo y
   * la home debe reflejar el catálogo actualizado
   */
  const getAllProducts = useCallback((reset = false) => {
    if (cacheAll.current && !reset) {
      setProducts(cacheAll.current);
      setHasMore(lastDocAll.current !== null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    activeCategory.current = null;
    getProducts()
      .then(({ products: data, lastDoc }) => {
        cacheAll.current = data;
        lastDocAll.current = lastDoc;
        setProducts(data);
        setHasMore(lastDoc !== null);
        setError(null);
      })
      .catch((err) => {
        setProducts([]);
        setHasMore(false);
        setError('Ocurrió un error al cargar los productos.');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  /*
   * Carga la siguiente página de productos y la concatena al estado/cache
   * No hace nada si no hay más docs que cargar
   */
  const loadMoreProducts = useCallback(() => {
    if (!lastDocAll.current) return;
    setLoading(true);
    getProducts(undefined, lastDocAll.current)
      .then(({ products: data, lastDoc }) => {
        const merged = [...(cacheAll.current || []), ...data];
        cacheAll.current = merged;
        lastDocAll.current = lastDoc;
        setProducts(merged);
        setHasMore(lastDoc !== null);
      })
      .catch((err) => {
        setError('Ocurrió un error al cargar más productos.');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  /*
   * Carga la primera página de una categoría (o resetea caché si reset=true)
   * Cachea por categoría: una categoría ya vista se sirve instantáneamente
   */
  const getProductsByCategoryCached = useCallback((categoryId, reset = false) => {
    const cached = cacheByCategory.current[categoryId];
    if (cached && !reset) {
      setProducts(cached.products);
      setHasMore(cached.lastDoc !== null);
      if (cached.products.length === 0) {
        setError(`No se encontraron productos para la categoría "${categoryId}".`);
      } else {
        setError(null);
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    activeCategory.current = categoryId;
    getProductsByCategory(categoryId)
      .then(({ products: data, lastDoc }) => {
        cacheByCategory.current[categoryId] = { products: data, lastDoc };
        lastDocByCategory.current[categoryId] = lastDoc;
        setProducts(data);
        setHasMore(lastDoc !== null);
        if (data.length === 0) {
          setError(`No se encontraron productos para la categoría "${categoryId}".`);
        } else {
          setError(null);
        }
      })
      .catch((err) => {
        setProducts([]);
        setHasMore(false);
        setError('Ocurrió un error al cargar los productos.');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  /*
   * Carga la siguiente página de una categoría y la concatena
   */
  const loadMoreByCategory = useCallback((categoryId) => {
    const lastDoc = lastDocByCategory.current[categoryId];
    if (!lastDoc) return;
    setLoading(true);
    getProductsByCategory(categoryId, undefined, lastDoc)
      .then(({ products: data, lastDoc: nextLastDoc }) => {
        const cached = cacheByCategory.current[categoryId];
        const merged = [...(cached?.products || []), ...data];
        cacheByCategory.current[categoryId] = { products: merged, lastDoc: nextLastDoc };
        lastDocByCategory.current[categoryId] = nextLastDoc;
        setProducts(merged);
        setHasMore(nextLastDoc !== null);
      })
      .catch((err) => {
        setError('Ocurrió un error al cargar más productos.');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  /*
   * Devuelve una Promise con un producto por su id
   * Mantiene la firma de promesa para que ItemDetailContainer conserve su
   * lógica de race condition (bandera cancelled)
   *
   * Fix: usa itemId como string directo, NO parseInt (Firestore autogenera
   * IDs alfanuméricos, parseInt devuelve NaN y rompe el caché)
   */
  const getProductByIdCached = useCallback((itemId) => {
    if (cacheById.current[itemId]) {
      return Promise.resolve(cacheById.current[itemId]);
    }
    return getProductById(itemId).then((data) => {
      if (data) {
        cacheById.current[data.id] = data;
      }
      return data;
    });
  }, []);

  /*
   * Invalida todos los cachés del contexto
   * Se usa cuando el admin crea/edita/elimina un producto para que
   * la home y las vistas de categoría reflejen los cambios
   */
  const invalidateAllCaches = useCallback(() => {
    cacheAll.current = null;
    cacheByCategory.current = {};
    cacheById.current = {};
    lastDocAll.current = null;
    lastDocByCategory.current = {};
    activeCategory.current = null;
  }, []);

  // Value memoizado: solo cambia cuando los estados reactivos cambian
  const value = useMemo(
    () => ({
      products,
      categories,
      loading,
      error,
      hasMore,
      getAllProducts,
      loadMoreProducts,
      getProductsByCategoryCached,
      loadMoreByCategory,
      getProductByIdCached,
      invalidateAllCaches,
    }),
    [products, categories, loading, error, hasMore, getAllProducts, loadMoreProducts, getProductsByCategoryCached, loadMoreByCategory, getProductByIdCached, invalidateAllCaches]
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsContext;