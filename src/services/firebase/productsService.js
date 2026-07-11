/*
 * Servicio de productos contra Firestore
 * Espeja las firmas que ProductsContext consume
 *
 * Optimizaciones aplicadas:
 * - limit() en cada consulta para no traer toda la colección
 * - startAfter(lastDoc) para paginación por cursor
 * - Categorías hardcodeadas como única fuente de verdad
 */
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  limit as fbLimit,
  startAfter,
} from 'firebase/firestore';
import { db } from './config';

// Categorías hardcodeadas: única fuente de verdad para NavBar y filtros
export const CATEGORIES = ['frutas', 'verduras', 'bebidas', 'otros'];

// Tamaño de página por defecto: controla cuántos productos trae cada consulta
export const DEFAULT_PAGE_SIZE = 8;

/*
 * Normaliza un doc de Firestore (campos en español) al formato que usa la app
 * Mapea: nombre→name, precio→price, categoria/category(array)→category(array)
 * disponibilidad→available(boolean), stock con fallback según disponibilidad
 */
const normalizeProduct = (id, data) => ({
  id,
  name: data.nombre,
  category: data.categoria || data.category || [],
  price: data.precio,
  stock: data.stock ?? (data.disponibilidad ? 99 : 0),
  description: data.descripcion || data.description || '',
  image: data.imageUrl || data.image || '',
  available: data.disponibilidad ?? true,
});

/*
 * Devuelve una página de productos de la colección /productos
 * Parámetros:
 *  - pageSize: cantidad de docs a traer (default DEFAULT_PAGE_SIZE)
 *  - lastDoc: último doc de la página anterior (para paginación con startAfter)
 * Devuelve: { products, lastDoc } donde lastDoc es el cursor para la próxima página
 * Si no hay más docs, lastDoc es null
 */
export const getProducts = (pageSize = DEFAULT_PAGE_SIZE, lastDoc = null) => {
  const constraints = [fbLimit(pageSize)];
  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }
  const q = query(collection(db, 'productos'), ...constraints);
  return getDocs(q)
    .then((snapshot) => {
      const docs = snapshot.docs.map((d) => normalizeProduct(d.id, d.data()));
      // lastDoc: cursor para la próxima página, null si no quedan más
      const nextLastDoc = docs.length < pageSize ? null : snapshot.docs[snapshot.docs.length - 1];
      return { products: docs, lastDoc: nextLastDoc };
    })
    .catch((err) => { console.error('Error al obtener productos:', err); throw err; });
};

/*
 * Devuelve una página de productos filtrados por categoría
 * Usa array-contains para soportar multi-categoría
 * Parámetros:
 *  - categoryId: categoría a filtrar
 *  - pageSize: cantidad de docs a traer
 *  - lastDoc: cursor de paginación
 * Devuelve: { products, lastDoc }
 */
export const getProductsByCategory = (categoryId, pageSize = DEFAULT_PAGE_SIZE, lastDoc = null) => {
  const constraints = [
    where('categoria', 'array-contains', categoryId),
    fbLimit(pageSize),
  ];
  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }
  const q = query(collection(db, 'productos'), ...constraints);
  return getDocs(q)
    .then((snapshot) => {
      const docs = snapshot.docs.map((d) => normalizeProduct(d.id, d.data()));
      const nextLastDoc = docs.length < pageSize ? null : snapshot.docs[snapshot.docs.length - 1];
      return { products: docs, lastDoc: nextLastDoc };
    })
    .catch((err) => { console.error('Error al obtener productos por categoría:', err); throw err; });
};

/*
 * Devuelve un solo producto por su id, o null si no existe
 * Usa getDoc (1 lectura) en lugar de query
 */
export const getProductById = (itemId) => {
  return getDoc(doc(db, 'productos', itemId))
    .then((d) => {
      if (!d.exists()) return null;
      return normalizeProduct(d.id, d.data());
    })
    .catch((err) => { console.error('Error al obtener producto por id:', err); throw err; });
};

// Devuelve las categorías hardcodeadas wrappeadas en Promise
export const getCategories = () => Promise.resolve(CATEGORIES);

/*
 * Crea un nuevo producto en /productos
 * Recibe los campos en español (nombre, categoria, precio, stock, etc.)
 * Devuelve el id del doc creado
 */
export const createProduct = (data) => {
  return addDoc(collection(db, 'productos'), { ...data, createdAt: serverTimestamp() })
    .then((ref) => ref.id)
    .catch((err) => { console.error('Error al crear producto:', err); throw err; });
};

/*
 * Actualiza un producto existente por su id
 * Recibe el id del doc y los campos a actualizar (parcial o total)
 * Actualiza el campo updatedAt con serverTimestamp
 */
export const updateProduct = (id, data) => {
  return updateDoc(doc(db, 'productos', id), { ...data, updatedAt: serverTimestamp() })
    .catch((err) => { console.error('Error al actualizar producto:', err); throw err; });
};

/*
 * Elimina un producto por su id
 */
export const deleteProduct = (id) => {
  return deleteDoc(doc(db, 'productos', id))
    .catch((err) => { console.error('Error al eliminar producto:', err); throw err; });
};