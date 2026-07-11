/*
 * Componente raíz de la aplicación
 * Envuelve todo en BrowserRouter para habilitar la navegación por rutas
 * Define las rutas principales usando Routes y Route
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from "./context/UserContext";
import { ProductsProvider } from "./context/ProductsContext";
import { CartProvider } from "./context/CartContext";
import NavBar from "./components/NavBar";
import ItemListContainer from "./components/ItemListContainer";
import ItemDetailContainer from "./components/ItemDetailContainer";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Login from "./components/Login";
import CreateProduct from "./components/CreateProduct";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      {/*
        Providers anidados: UserProvider (auth) por fuera,
        ProductsProvider (catálogo) y CartProvider (carrito) por dentro
      */}
      <UserProvider>
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
                {/* Ruta de checkout: requiere user logueado */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                {/* Ruta de login: formulario de inicio de sesión y registro */}
              <Route path="/login" element={<Login />} />
              {/* Ruta admin: formulario para publicar productos (requiere isAdmin) */}
              <Route
                path="/admin/create-product"
                element={
                  <ProtectedRoute requireAdmin>
                    <CreateProduct />
                  </ProtectedRoute>
                }
              />
              {/* Ruta comodín: página 404 para cualquier ruta no definida */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </CartProvider>
        </ProductsProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
