/*
 * Servicio de autenticación contra Firebase Auth
 * Expone register, login, logout y onAuthChange
 * register crea además un doc en /users/{uid} con isAdmin: false
 */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

/*
 * Registra un nuevo usuario con email y password
 * Actualiza el displayName en el perfil de Auth y crea un doc en /users/{uid}
 * con los campos: email, displayName, isAdmin: false
 */
export const registerUser = async (email, password, displayName) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  // Actualiza el displayName en el perfil de Auth
  await updateProfile(user, { displayName });
  // Crea el doc del usuario en Firestore con rol por defecto
  await setDoc(doc(db, 'users', user.uid), {
    email,
    displayName,
    isAdmin: false,
  });
  return user;
};

/*
 * Inicia sesión con email y password
 * Devuelve el user de Firebase Auth
 */
export const loginUser = async (email, password) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

/*
 * Cierra la sesión del usuario actual
 */
export const logoutUser = async () => {
  await signOut(auth);
};

/*
 * Suscripción a cambios de estado de autenticación
 * onAuthStateChanged devuelve una función de desuscripción
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/*
 * Obtiene los datos del doc /users/{uid} para leer isAdmin
 * Devuelve null si el doc no existe (usuario sin doc asociado)
 */
export const getUserData = async (uid) => {
  const d = await getDoc(doc(db, 'users', uid));
  if (!d.exists()) return null;
  return d.data();
};