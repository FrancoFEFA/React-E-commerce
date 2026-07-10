/*
 * Contexto del carrito de compras
 * Mantiene el estado global de los items agregados por el usuario
 * Expone métodos para agregar, remover, limpiar y consultar el carrito
 * Evita duplicados: si un item ya existe, acumula su cantidad
 */
import { createContext, useState } from 'react';

// Creación del contexto del carrito
const CartContext = createContext();

/*
 * Provider que envuelve la aplicación y expone el estado del carrito
 * Recibe children y provee el value con el estado y los métodos
 */
export const CartProvider = ({ children }) => {
  // Estado del carrito: array de objetos { id, name, price, image, quantity }
  const [cart, setCart] = useState([]);

  /*
   * Verifica si un item ya está en el carrito por su id
   * Devuelve true|false
   */
  const isInCart = (id) => {
    return cart.some((item) => item.id === id);
  };

  /*
   * Agrega cierta cantidad de un item al carrito
   * Si el item ya existe (por id), acumula la cantidad en lugar de duplicarlo
   * Si no existe, lo agrega como un nuevo objeto al array
   */
  const addItem = (item, quantity) => {
    if (isInCart(item.id)) {
      // El item ya está en el carrito: actualizamos su cantidad
      setCart(
        cart.map((prod) =>
          prod.id === item.id
            ? { ...prod, quantity: prod.quantity + quantity }
            : prod
        )
      );
    } else {
      // El item no está: lo agregamos como objeto nuevo con la cantidad indicada
      setCart([
        ...cart,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity,
        },
      ]);
    }
  };

  /*
   * Remueve un item del carrito usando su id
   * Filtra el array excluyendo el item con ese id
   */
  const removeItem = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  /*
   * Remueve todos los items del carrito
   * Resetea el estado a un array vacío
   */
  const clear = () => {
    setCart([]);
  };

  /*
   * Total de unidades en el carrito (suma de todas las cantidades)
   * Se usa para el badge del CartWidget
   */
  const totalQuantity = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  /*
   * Precio total del carrito (suma de precio * cantidad de cada item)
   * Se usa para el desglose del Cart
   */
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Value expuesto a los consumidores del contexto
  const value = {
    cart,
    addItem,
    removeItem,
    clear,
    isInCart,
    totalQuantity,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;