/*
 * Datos mock del catálogo de productos
 * Cada producto tiene id, nombre, categoría, precio, stock, descripción y emoji
 * Las categorías se definen una sola vez para evitar duplicación entre componentes
 */
export const categories = ['frutas', 'verduras', 'lacteos', 'bebidas'];

const products = [
  // ---- Frutas ----
  {
    id: 1,
    name: 'Manzana Roja',
    category: 'frutas',
    price: 250,
    stock: 20,
    description:
      'Manzana roja fresca, ideal para ensaladas y postres. Rica en fibra y antioxidantes naturales.',
    image: '🍎',
  },
  {
    id: 2,
    name: 'Banana',
    category: 'frutas',
    price: 180,
    stock: 15,
    description:
      'Banana madura y dulce, perfecta para licuados y como snack saludable.',
    image: '🍌',
  },
  {
    id: 3,
    name: 'Naranja',
    category: 'frutas',
    price: 220,
    stock: 18,
    description:
      'Naranja jugosa y dulce, excelente fuente de vitamina C para jugos naturales.',
    image: '🍊',
  },
  {
    id: 4,
    name: 'Pera',
    category: 'frutas',
    price: 280,
    stock: 12,
    description:
      'Pera dulce y aromática, cosechada en su punto justo de maduración.',
    image: '🍐',
  },

  // ---- Verduras ----
  {
    id: 5,
    name: 'Lechuga',
    category: 'verduras',
    price: 120,
    stock: 30,
    description:
      'Lechuga crujiente recién cosechada, base ideal para tus ensaladas frescas.',
    image: '🥬',
  },
  {
    id: 6,
    name: 'Tomate',
    category: 'verduras',
    price: 200,
    stock: 25,
    description:
      'Tomate maduro y jugoso, cultivado sin pesticidas. Perfecto para salsas caseras.',
    image: '🍅',
  },
  {
    id: 7,
    name: 'Zanahoria',
    category: 'verduras',
    price: 150,
    stock: 40,
    description:
      'Zanahoria fresca de huerta, rica en vitamina A. Ideal para guisos y ensaladas.',
    image: '🥕',
  },
  {
    id: 8,
    name: 'Papa',
    category: 'verduras',
    price: 300,
    stock: 50,
    description:
      'Papa blanca de primera calidad, versátil para purés, frituras y guisos.',
    image: '🥔',
  },

  // ---- Lácteos ----
  {
    id: 9,
    name: 'Leche Fresca',
    category: 'lacteos',
    price: 190,
    stock: 22,
    description:
      'Leche entera fresca de tambo, sin conservantes. Envase de 1 litro.',
    image: '🥛',
  },
  {
    id: 10,
    name: 'Queso Crema',
    category: 'lacteos',
    price: 450,
    stock: 10,
    description:
      'Queso crema suave y untable, ideal para desayunos y postres. 200g.',
    image: '🧀',
  },

  // ---- Bebidas ----
  {
    id: 11,
    name: 'Jugo de Naranja Natural',
    category: 'bebidas',
    price: 350,
    stock: 15,
    description:
      'Jugo exprimido natural 100% fruta, sin azúcar agregada. Botella de 500ml.',
    image: '🧃',
  },
  {
    id: 12,
    name: 'Licuado Verde',
    category: 'bebidas',
    price: 400,
    stock: 8,
    description:
      'Licuado detox de espinaca, manzana verde, apio y jengibre. 500ml.',
    image: '🥤',
  },
];

/*
 * Promesa que simula una llamada asíncrona a una API
 * Resuelve luego de 1.5 segundos con el array completo de productos
 */
export const getProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products);
    }, 1500);
  });
};

/*
 * Devuelve un array con las categorías disponibles en el catálogo
 * Usa la constante exportada para mantener una única fuente de verdad
 */
export const getCategories = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(categories);
    }, 500);
  });
};

/*
 * Promesa que recibe un categoryId y devuelve los productos filtrados
 * Si no encuentra productos para esa categoría, devuelve array vacío
 */
export const getProductsByCategory = (categoryId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = products.filter(
        (product) => product.category === categoryId
      );
      resolve(filtered);
    }, 1500);
  });
};

/*
 * Promesa que recibe un itemId y devuelve un solo producto
 * Si no lo encuentra, devuelve null para manejar el error en el contenedor
 */
export const getProductById = (itemId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = products.find((p) => p.id === parseInt(itemId));
      resolve(product || null);
    }, 1500);
  });
};

export default products;
