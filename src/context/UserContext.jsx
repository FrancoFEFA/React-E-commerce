/*
 * Contexto del usuario autenticado
 * Mantiene el estado global del user logueado y su rol (isAdmin)
 * Escucha onAuthStateChanged para persistir la sesión entre recargas
 * Expone métodos login, register y logout
 */
import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  registerUser,
  loginUser,
  logoutUser,
  onAuthChange,
  getUserData,
} from '../services/firebase/authService';

const UserContext = createContext();

/*
 * Provider que envuelve la aplicación y expone el estado del usuario
 * loading: true mientras onAuthStateChanged resuelve por primera vez
 * user: null si no hay sesión, o { uid, email, displayName, isAdmin }
 */
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
   * Al montar el provider suscribe a onAuthStateChanged
   * - Si hay user auth: consulta /users/{uid} para obtener isAdmin
   * - Si no hay user auth: setea null
   * La desuscripción se hace en el cleanup del efecto
   */
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Consulta el doc para obtener isAdmin
        const userData = await getUserData(firebaseUser.uid);
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || '',
          isAdmin: userData?.isAdmin ?? false,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /*
   * Registra un nuevo usuario y setea el user en el estado
   * Llama a registerUser del authService
   */
  const register = useCallback(async (email, password, displayName) => {
    const firebaseUser = await registerUser(email, password, displayName);
    setUser({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName,
      isAdmin: false,
    });
  }, []);

  /*
   * Inicia sesión: onAuthStateChanged se encarga de setear el user
   * No setea manualmente para evitar inconsistencias con el listener
   */
  const login = useCallback(async (email, password) => {
    await loginUser(email, password);
  }, []);

  /*
   * Cierra sesión: onAuthStateChanged se encarga de setear user en null
   */
  const logout = useCallback(async () => {
    await logoutUser();
  }, []);

  // Value memoizado: solo cambia cuando user o loading cambian
  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;