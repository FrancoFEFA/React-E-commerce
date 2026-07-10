/*
 * Componente raíz de la aplicación
 * Envuelve todo en BrowserRouter para habilitar la navegación por rutas
 * Define las rutas principales usando Routes y Route
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProductsProvider } from "./context/ProductsContext";
import { CartProvider } from "./context/CartContext";
import NavBar from "./components/NavBar";
import ItemListContainer from "./components/ItemListContainer";
import ItemDetailContainer from "./components/ItemDetailContainer";
import Cart from "./components/Cart";
import NotFound from "./components/NotFound";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      {/*
        Providers anidados: ProductsProvider (catálogo con caché) por fuera
        y CartProvider (carrito) por dentro. Son independientes entre sí
      */}
      <ProductsProvider>
        <CartProvider>
          <div className="app">
            {/* NavBar se muestra en todas las vistas, fuera del switch de rutas */}
            <NavBar />
            {/* Definición de las rutas de la aplicación */}
            <Routes>
              {/* Ruta raíz: catálogo completo de productos con saludo de bienvenida */}
              <Route
                path="/"
                element={<ItemListContainer greeting="¡Bienvenidos proximamente Fresh!" />}
              />
              {/* Ruta con parámetro dinámico de categoría: filtra productos por categoría */}
              <Route path="/category/:categoryId" element={<ItemListContainer />} />
              {/* Ruta con parámetro dinámico de producto: vista en detalle */}
              <Route path="/item/:itemId" element={<ItemDetailContainer />} />
              {/* Ruta del carrito: desglose de la compra */}
              <Route path="/cart" element={<Cart />} />
              {/* Ruta comodín: página 404 para cualquier ruta no definida */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </CartProvider>
      </ProductsProvider>
    </BrowserRouter>
  );
}

export default App;
