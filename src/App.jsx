/*
 * Componente raíz de la aplicación
 * Envuelve todo en BrowserRouter para habilitar la navegación por rutas
 * Define las rutas principales usando Routes y Route
 * Estructura de secciones: Inicio (/), Productos (/productos), Nosotros (/nosotros)
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from "./context/UserContext";
import { ProductsProvider } from "./context/ProductsContext";
import { CartProvider } from "./context/CartContext";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import ItemListContainer from "./components/ItemListContainer";
import ItemDetailContainer from "./components/ItemDetailContainer";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Login from "./components/Login";
import About from "./components/About";
import CreateProduct from "./components/CreateProduct";
import AdminProducts from "./components/AdminProducts";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import "./App.scss";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
                {/* Sección Inicio: landing page con hero, categorías y destacados */}
                <Route path="/" element={<Home />} />

                {/* Sección Productos: catálogo completo y filtrado por categoría */}
                <Route path="/productos" element={<ItemListContainer />} />
                <Route path="/productos/:categoryId" element={<ItemListContainer />} />

                {/* Vista de detalle de un producto (mantiene ruta /item/:itemId) */}
                <Route path="/item/:itemId" element={<ItemDetailContainer />} />

                {/* Sección Nosotros: historia, misión y contacto */}
                <Route path="/nosotros" element={<About />} />

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

                {/* Ruta admin: panel para administrar productos (editar/eliminar) */}
                <Route
                  path="/admin/productos"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminProducts />
                    </ProtectedRoute>
                  }
                />

                {/* Ruta comodín: página 404 para cualquier ruta no definida */}
                <Route path="*" element={<NotFound />} />
              </Routes>

              {/* Footer se muestra en todas las vistas, abajo del contenido */}
              <Footer />
            </div>
          </CartProvider>
        </ProductsProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;