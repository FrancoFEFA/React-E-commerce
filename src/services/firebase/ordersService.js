/*
 * Servicio de órdenes contra Firestore
 * createOrder: persiste una orden en la colección /orders
 * getOrdersByUser: devuelve las órdenes de un usuario por su uid
 */
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

/*
 * Crea una nueva orden en la colección /orders
 * Recibe el carrito, el total, los datos del comprador y el uid del user
 * Devuelve el id de la orden creada
 */
export const createOrder = async ({ items, total, buyer, userId }) => {
  const orderData = {
    items: items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    })),
    total,
    buyer,
    userId,
    status: 'pending',
    createdAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, 'orders'), orderData);
  return ref.id;
};

/*
 * Devuelve las órdenes de un usuario por su uid
 * Solo visible para el usuario dueño (reglas de Firestore validan)
 */
export const getOrdersByUser = async (userId) => {
  const q = query(
    collection(db, 'orders'),
    where('userId', '==', userId),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};