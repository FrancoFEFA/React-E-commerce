import { collection, getDocs, getDoc, doc, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

// Categorías hardcodeadas: única fuente de verdad para NavBar y filtros
const CATEGORIES = ['frutas', 'verduras', 'lacteos', 'bebidas'];

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

// Devuelve todos los productos de la colección /productos
export const getProducts = () => {
  return getDocs(collection(db, 'productos'))
    .then((snapshot) => snapshot.docs.map((d) => normalizeProduct(d.id, d.data())))
    .catch((err) => { console.error('Error al obtener productos:', err); throw err; });
};

// Filtra productos por categoría usando array-contains (categoria es array multi-categoría)
export const getProductsByCategory = (categoryId) => {
  const field = 'categoria';
  const q = query(collection(db, 'productos'), where(field, 'array-contains', categoryId));
  return getDocs(q)
    .then((snapshot) => snapshot.docs.map((d) => normalizeProduct(d.id, d.data())))
    .catch((err) => { console.error('Error al obtener productos por categoría:', err); throw err; });
};

// Devuelve un solo producto por su id, o null si no existe
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

// Crea un nuevo producto en /productos (para uso del admin en la Entrega 3)
export const createProduct = (data) => {
  console.log('Creando doc en Firestore /productos...', data);
  return addDoc(collection(db, 'productos'), { ...data, createdAt: serverTimestamp() })
    .then((ref) => { console.log('Doc creado con id:', ref.id); return ref.id; })
    .catch((err) => { console.error('Error al crear producto:', err); throw err; });
};