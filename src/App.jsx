// Importar componentes reutilizables y estilos globales
import NavBar from "./components/NavBar";
import ItemListContainer from "./components/ItemListContainer";
import "./App.css";

// Componente principal de la aplicación
function App() {
  return (
    <div className="app">
      {/* Barra de navegación con enlaces y carrito */}
      <NavBar />
      {/* Contenedor principal de la lista de productos y bienvenida */}
      <ItemListContainer greeting="¡Bienvenidos proximamente Fresh!" />
    </div>
  );
}

// Exportar el componente App para su uso en el resto de la aplicación
export default App;
