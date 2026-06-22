/*
 * Componente presentacional: filtros de categoría para la vista de inicio
 * Muestra botones con todas las categorías disponibles y una opción "Todas"
 * Al hacer clic, notifica al componente padre cuál categoría seleccionar
 */
const CategoryFilter = ({ categories, selected, onSelect }) => {
  return (
    <div className="category-filter">
      <p className="category-filter-label">Filtrar por categoría:</p>
      <div className="category-filter-buttons">
        <button
          className={`category-filter-btn ${selected === 'todas' ? 'active' : ''}`}
          onClick={() => onSelect('todas')}
        >
          Todas
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`category-filter-btn ${selected === category ? 'active' : ''}`}
            onClick={() => onSelect(category)}
          >
            {/* Muestra la categoría con la primera letra en mayúscula */}
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
