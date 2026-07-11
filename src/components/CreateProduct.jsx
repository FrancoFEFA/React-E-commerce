/*
 * Componente CreateProduct: formulario para que el admin publique productos
 * Permite cargar nombre, categoría, precio, stock, descripción e imagen
 * La imagen se comprime a base64 (400x400 JPEG) y se guarda en Firestore
 * No requiere Firebase Storage: el base64 se guarda directo en el doc
 * Visible solo para usuarios con isAdmin: true (wrappado por ProtectedRoute)
 */
import { useState } from 'react';
import { createProduct, CATEGORIES } from '../services/firebase/productsService';
import { useProducts } from '../context/useProducts';
import { fileToCompressedBase64, MAX_FILE_SIZE } from '../utils/imageCompression';

const CreateProduct = () => {
  // Estado del formulario
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState([]);
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [disponibilidad, setDisponibilidad] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Estado de UI: submitting, success y error
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Acceso al contexto para resetear el caché y re-fetchear tras publicar un producto
  const { invalidateAllCaches, getAllProducts } = useProducts();

  /*
   * Maneja la selección de imagen: valida tamaño, guarda archivo y genera preview
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setErrorMsg('La imagen es demasiado grande (máx 2MB).');
        return;
      }
      setErrorMsg(null);
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  /*
   * Toggle de categoría: agrega o remueve del array categoria (multi-categoría)
   */
  const handleCategoryToggle = (cat) => {
    if (categoria.includes(cat)) {
      setCategoria(categoria.filter((c) => c !== cat));
    } else {
      setCategoria([...categoria, cat]);
    }
  };

  /*
   * Resetea el formulario a sus valores iniciales
   */
  const resetForm = () => {
    setNombre('');
    setCategoria([]);
    setPrecio('');
    setStock('');
    setDescripcion('');
    setDisponibilidad(true);
    setImageFile(null);
    setImagePreview(null);
  };

  /*
   * Maneja el submit: comprime la imagen a base64, luego crea el doc en Firestore
   * Campos se guardan en español (nombre, precio, categoria, image, etc.)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (categoria.length === 0) {
      setErrorMsg('Seleccioná al menos una categoría.');
      return;
    }

    setErrorMsg(null);
    setSuccess(false);
    setSubmitting(true);

    try {
      // Si hay imagen seleccionada, la comprime a base64
      let image = '';
      if (imageFile) {
        image = await fileToCompressedBase64(imageFile);
      }

      // Crea el doc en Firestore con los campos en español
      await createProduct({
        nombre,
        categoria,
        precio: Number(precio),
        stock: Number(stock),
        descripcion,
        disponibilidad,
        image,
      });

      // Éxito: resetea el caché del contexto para que la home refleje el nuevo producto
      setSuccess(true);
      resetForm();
      invalidateAllCaches();
      getAllProducts(true);
    } catch (err) {
      const errMsg = err?.message || err?.code || 'Error desconocido';
      setErrorMsg(`Error: ${errMsg}`);
      console.error('Error al publicar:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-product-container">
      <h2 className="create-product-title">Publicar producto</h2>

      {/* Mensaje de éxito si se publicó correctamente */}
      {success && (
        <p className="create-product-success">
          Producto publicado correctamente.
        </p>
      )}

      {/* Mensaje de error si falló */}
      {errorMsg && <p className="create-product-error">{errorMsg}</p>}

      <form className="create-product-form" onSubmit={handleSubmit}>
        {/* Nombre del producto */}
        <div className="form-field">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            className="form-input"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Ej: Manzana Roja"
          />
        </div>

        {/* Categorías: selección múltiple (multi-categoría) */}
        <div className="form-field">
          <label className="form-label">Categorías</label>
          <div className="form-category-toggles">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-toggle-btn ${categoria.includes(cat) ? 'active' : ''}`}
                onClick={() => handleCategoryToggle(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Precio */}
        <div className="form-field">
          <label className="form-label">Precio</label>
          <input
            type="number"
            className="form-input"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
            min="0"
            placeholder="Ej: 250"
          />
        </div>

        {/* Stock */}
        <div className="form-field">
          <label className="form-label">Stock</label>
          <input
            type="number"
            className="form-input"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            min="0"
            placeholder="Ej: 20"
          />
        </div>

        {/* Descripción */}
        <div className="form-field">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-textarea"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows="3"
            placeholder="Descripción del producto"
          />
        </div>

        {/* Disponibilidad: toggle boolean */}
        <div className="form-field">
          <label className="form-label">Disponibilidad</label>
          <button
            type="button"
            className={`toggle-btn ${disponibilidad ? 'active' : ''}`}
            onClick={() => setDisponibilidad(!disponibilidad)}
          >
            {disponibilidad ? 'Disponible' : 'No disponible'}
          </button>
        </div>

        {/* Imagen: input file con preview */}
        <div className="form-field">
          <label className="form-label">Imagen del producto</label>
          <input
            type="file"
            accept="image/*"
            className="form-input-file"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Vista previa"
              className="form-image-preview"
            />
          )}
        </div>

        {/* Botón de submit */}
        <button
          type="submit"
          className="create-product-submit-btn"
          disabled={submitting}
        >
          {submitting ? 'Publicando...' : 'Publicar producto'}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;