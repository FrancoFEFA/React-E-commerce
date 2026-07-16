/*
 * Componente Home: landing page de la verdulería
 * Estructura: Hero + grid de categorías + productos destacados + teaser Nosotros
 * Usa el ProductsContext para obtener productos destacados (primeros 8)
 */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/useProducts';
import ItemList from './ItemList';
import hero from '../../assets/Nosotros-hero.png';

// Importación de las imágenes para cada categoría
import imgFrutas from '../../assets/cat_frutas.png';
import imgVerduras from '../../assets/cat_verduras.png';
import imgBebidas from '../../assets/cat_bebidas.png';
import imgOtros from '../../assets/cat_otros.png';

// Datos visuales de las categorías para el grid del Home
const CATEGORY_CARDS = [
  { id: 'frutas', image: imgFrutas, label: 'Frutas' },
  { id: 'verduras', image: imgVerduras, label: 'Verduras' },
  { id: 'bebidas', image: imgBebidas, label: 'Bebidas' },
  { id: 'otros', image: imgOtros, label: 'Otros' },
];

const Home = () => {
  // Consumo del contexto para obtener productos destacados
  const { products, loading, getAllProducts } = useProducts();

  /*
   * Al montar el Home carga los productos del catálogo
   * Los primeros 8 se usan como "destacados"
   */
  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  // Productos destacados: primeros 8 del catálogo
  const featured = products.slice(0, 8);

  return (
    <div className="home">
      {/* Hero: imagen + título + subtítulo + CTA */}
      <section className="home-hero">
        <img src={hero} alt="Verdulería Colón" className="home-hero-img" />
        <div className="home-hero-overlay">
          <h1 className="home-hero-title">Verdulería Colón</h1>
          <p className="home-hero-subtitle">
            Frutas y verduras frescas directo del campo a tu mesa.
          </p>
          <Link to="/productos" className="home-hero-btn">
            Ver productos
          </Link>
        </div>
      </section>

      {/* Grid de categorías: cards con ícono y link a /productos/:categoryId */}
      <section className="home-categories">
        <h2 className="home-section-title">Nuestras categorías</h2>
        <div className="home-categories-grid">
          {CATEGORY_CARDS.map((cat) => (
            <Link
              key={cat.id}
              to={`/productos/${cat.id}`}
              className="home-category-card"
            >
              <img src={cat.image} alt={cat.label} className="home-category-img" />
              <div className="home-category-overlay">
                <span className="home-category-label">{cat.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Productos destacados: grilla de los primeros 8 */}
      <section className="home-featured">
        <h2 className="home-section-title">Productos destacados</h2>
        {loading ? (
          <div className="status-container">
            <p className="loading-text">Cargando productos...</p>
          </div>
        ) : featured.length > 0 ? (
          <ItemList products={featured} />
        ) : (
          <p className="home-empty-text">Todavía no hay productos cargados.</p>
        )}
      </section>

      {/* Teaser Nosotros: bloque con CTA a /nosotros */}
      <section className="home-about-teaser">
        <div className="home-about-teaser-content">
          <h2 className="home-section-title">Conocenos</h2>
          <p className="home-about-teaser-text">
            Somos una verdulería familiar comprometida con la frescura y
            la calidad de cada producto que llega a tu hogar.
          </p>
          <Link to="/nosotros" className="home-about-teaser-btn">
            Sobre nosotros
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;