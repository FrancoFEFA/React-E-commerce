import { useContext } from 'react';
import UserContext from './UserContext';

// Hook de acceso al contexto del usuario para consumirlo desde cualquier componente
export const useUser = () => useContext(UserContext);