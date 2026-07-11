/*
 * Servicio de órdenes contra Firestore
 * createOrder: persiste una orden en la colección /orders
 */
import {
  collection,
  addDoc,
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