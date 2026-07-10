import { useContext } from 'react';
import ProductsContext from './ProductsContext';

// Hook de acceso al contexto del catálogo para consumirlo desde cualquier componente
export const useProducts = () => useContext(ProductsContext);
