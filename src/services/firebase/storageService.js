/*
 * Servicio de Firebase Storage para subir imágenes de productos
 * uploadProductImage: sube el archivo a /products/{timestamp} y devuelve la URL pública
 */
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

/*
 * Sube una imagen a Firebase Storage y devuelve la URL pública
 * La ruta usa timestamp para evitar colisiones de nombre
 * Devuelve la URL de descarga para guardarla como imageUrl en Firestore
 */
export const uploadProductImage = async (file) => {
  // Genera una referencia única basada en el timestamp
  const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
  console.log('Subiendo imagen a Storage...');

  // Sube el archivo en formato blob/raw
  await uploadBytes(storageRef, file);
  console.log('Imagen subida, obteniendo URL...');

  // Obtiene y devuelve la URL pública de descarga
  const url = await getDownloadURL(storageRef);
  console.log('URL obtenida:', url);
  return url;
};