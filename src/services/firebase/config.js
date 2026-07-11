/*
 * Inicialización de Firebase
 * Lee las credenciales desde variables de entorno (prefijo VITE_ de Vite)
 * Exporta las instancias de Firestore (db), Auth y Storage
 * Analytics se inicializa de forma segura solo si el entorno lo soporta
 */
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Configuración leída desde .env.local
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Inicialización de la app de Firebase
const app = initializeApp(firebaseConfig);

// Instancias exportadas para usar en los servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

/*
 * Analytics: solo se inicializa si el navegador lo soporta
 * Evita errores en entornos sin DOM o con tracking bloqueado
 */
isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  }
});