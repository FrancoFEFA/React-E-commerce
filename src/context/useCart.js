import { useContext } from 'react';
import CartContext from './CartContext';

// Hook de acceso al contexto del carrito para consumirlo desde cualquier componente
export const useCart = () => useContext(CartContext);
