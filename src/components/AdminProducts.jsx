/*
 * Componente AdminProducts: panel de administración de productos
 * Lista todos los productos y permite editar/eliminar cada uno
 * Re-utiliza el formulario del CreateProduct para edición
 * Visible solo para usuarios con isAdmin: true (wrappado por ProtectedRoute)
 */
import { useState, useEffect } from 'react';
import {
  updateProduct,
  deleteProduct,
  CATEGORIES,
} from '../services/firebase/productsService';
import { useProducts } from '../context/useProducts';
import { fileToCompressedBase64, MAX_FILE_SIZE } from '../utils/imageCompression';

const AdminProducts = () => {
  const {
    products,
    loading,
    error,
    getAllProducts,
    invalidateAllCaches,
  } = useProducts();

  // Estado del producto que se está editando (null = ningún)
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Modo edición bulk: activa inputs inline de stock/disponibilidad
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkEdits, setBulkEdits] = useState({});

  // Búsqueda local para filtrar productos por nombre en el panel admin
  const [adminSearch, setAdminSearch] = useState('');

  // Productos filtrados por término de búsqueda (case-insensitive)
  const filteredProducts = adminSearch.trim()
    ? products.filter((p) =>
        p.name.toLowerCase().includes(adminSearch.toLowerCase().trim())
      )
    : products;

  /*
   * Activa el modo bulk: inicializa el snapshot de ediciones
   * con los valores actuales de cada producto
   */
  const toggleBulkMode = () => {
    if (!bulkMode) {
      const snapshot = {};
      products.forEach((p) => {
        snapshot[p.id] = { stock: p.stock, disponibilidad: p.available };
      });
      setBulkEdits(snapshot);
    }
    setBulkMode(!bulkMode);
    setActionError(null);
    setActionSuccess(null);
  };

  // Actualiza un campo del snapshot bulk para un producto
  const handleBulkChange = (productId, field, value) => {
    setBulkEdits({
      ...bulkEdits,
      [productId]: {
        ...bulkEdits[productId],
        [field]: field === 'stock' ? Number(value) : value,
      },
    });
  };

  /*
   * Guarda todos los cambios del modo bulk
   * Solo actualiza los productos cuyo stock o disponibilidad cambiaron
   */
  const handleBulkSave = async () => {
    setActionError(null);
    setActionSuccess(null);
    setSubmitting(true);
    try {
      const updates = products
        .filter((p) => {
          const edit = bulkEdits[p.id];
          if (!edit) return false;
          return edit.stock !== p.stock || edit.disponibilidad !== p.available;
        })
        .map((p) =>
          updateProduct(p.id, {
            stock: bulkEdits[p.id].stock,
            disponibilidad: bulkEdits[p.id].disponibilidad,
          })
        );
      await Promise.all(updates);
      setActionSuccess(`${updates.length} producto(s) actualizado(s).`);
      setBulkMode(false);
      setBulkEdits({});
      invalidateAllCaches();
      getAllProducts(true);
    } catch (err) {
      setActionError(`Error: ${err?.message || err?.code || 'Error desconocido'}`);
      console.error('Error al guardar bulk:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Carga todos los productos al montar
  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  // Inicia la edición del producto: carga el formulario con sus valores
  const startEdit = (product) => {
    setEditingId(product.id);
    setEditForm({
      nombre: product.name,
      categoria: product.category || [],
      precio: String(product.price),
      stock: String(product.stock),
      descripcion: product.description,
      disponibilidad: product.available,
      image: product.image,
    });
    setImageFile(null);
    setImagePreview(product.image || null);
    setActionError(null);
    setActionSuccess(null);
  };

  // Cancela la edición
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
    setImageFile(null);
    setImagePreview(null);
    setActionError(null);
  };

  // Toggle de categoría en el formulario de edición
  const handleCategoryToggle = (cat) => {
    if (!editForm) return;
    const current = editForm.categoria;
    const updated = current.includes(cat)
      ? current.filter((c) => c !== cat)
      : [...current, cat];
    setEditForm({ ...editForm, categoria: updated });
  };

  // Maneja selección de nueva imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setActionError('La imagen es demasiado grande (máx 2MB).');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Guardar los cambios
  const handleSave = async (e) => {
    e.preventDefault();
    if (!editForm) return;
    if (editForm.categoria.length === 0) {
      setActionError('Seleccioná al menos una categoría.');
      return;
    }
    setActionError(null);
    setSubmitting(true);
    try {
      let image = editForm.image;
      if (imageFile) {
        image = await fileToCompressedBase64(imageFile);
      }
      await updateProduct(editingId, {
        nombre: editForm.nombre,
        categoria: editForm.categoria,
        precio: Number(editForm.precio),
        stock: Number(editForm.stock),
        descripcion: editForm.descripcion,
        disponibilidad: editForm.disponibilidad,
        image,
      });
      setActionSuccess('Producto actualizado correctamente.');
      setEditingId(null);
      setEditForm(null);
      setImageFile(null);
      setImagePreview(null);
      invalidateAllCaches();
      getAllProducts(true);
    } catch (err) {
      setActionError(`Error: ${err?.message || err?.code || 'Error desconocido'}`);
      console.error('Error al actualizar:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Eliminar un producto
  const handleDelete = async (productId, productName) => {
    const confirmar = window.confirm(
      `¿Eliminar "${productName}"? Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;
    setActionError(null);
    setSubmitting(true);
    try {
      await deleteProduct(productId);
      setActionSuccess(`Producto "${productName}" eliminado.`);
      invalidateAllCaches();
      getAllProducts(true);
    } catch (err) {
      setActionError(`Error: ${err?.message || err?.code || 'Error desconocido'}`);
      console.error('Error al eliminar:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-products-container">
      <h2 className="admin-products-title">Administrar productos</h2>

      {/* Controles del modo bulk + buscador */}
      <div className="admin-bulk-controls">
        <button
          className={`admin-bulk-toggle-btn ${bulkMode ? 'active' : ''}`}
          onClick={toggleBulkMode}
          disabled={submitting || editingId !== null}
        >
          {bulkMode ? 'Cancelar edición rápida' : 'Edición rápida de stock'}
        </button>
        {bulkMode && (
          <button
            className="admin-bulk-save-btn"
            onClick={handleBulkSave}
            disabled={submitting}
          >
            {submitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        )}

        {/* Buscador de productos en el panel admin */}
        <input
          type="text"
          className="admin-search-input"
          placeholder="Buscar producto..."
          value={adminSearch}
          onChange={(e) => setAdminSearch(e.target.value)}
        />
        {adminSearch && (
          <button
            className="admin-search-clear"
            onClick={() => setAdminSearch('')}
            type="button"
          >
            Borrar
          </button>
        )}
      </div>

      {actionError && <p className="admin-products-error">{actionError}</p>}
      {actionSuccess && <p className="admin-products-success">{actionSuccess}</p>}

      {loading && (
        <div className="status-container">
          <p className="loading-text">Cargando...</p>
        </div>
      )}

      {error && !loading && (
        <div className="status-container">
          <p className="error-text">{error}</p>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="admin-products-empty">
          No hay productos cargados.
        </p>
      )}

      {/* Sin resultados de búsqueda */}
      {!loading && !error && products.length > 0 && filteredProducts.length === 0 && (
        <p className="admin-products-empty">
          No se encontraron productos para "{adminSearch}".
        </p>
      )}

      {!loading && !error && products.length > 0 && (
        <ul className="admin-products-list">
          {filteredProducts.map((product) => (
            <li key={product.id} className="admin-product-item">
              {/* Modo edición inline */}
              {editingId === product.id && editForm ? (
                <form className="admin-edit-form" onSubmit={handleSave}>
                  <div className="admin-edit-header">
                    <h3 className="admin-edit-title">Editando: {product.name}</h3>
                    <button
                      type="button"
                      className="admin-edit-cancel"
                      onClick={cancelEdit}
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editForm.nombre}
                      onChange={(e) =>
                        setEditForm({ ...editForm, nombre: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Categorías</label>
                    <div className="form-category-toggles">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          className={`category-toggle-btn ${
                            editForm.categoria.includes(cat) ? 'active' : ''
                          }`}
                          onClick={() => handleCategoryToggle(cat)}
                        >
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Precio</label>
                    <input
                      type="number"
                      className="form-input"
                      value={editForm.precio}
                      onChange={(e) =>
                        setEditForm({ ...editForm, precio: e.target.value })
                      }
                      required
                      min="0"
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Stock</label>
                    <input
                      type="number"
                      className="form-input"
                      value={editForm.stock}
                      onChange={(e) =>
                        setEditForm({ ...editForm, stock: e.target.value })
                      }
                      required
                      min="0"
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-textarea"
                      value={editForm.descripcion}
                      onChange={(e) =>
                        setEditForm({ ...editForm, descripcion: e.target.value })
                      }
                      rows="3"
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Disponibilidad</label>
                    <button
                      type="button"
                      className={`toggle-btn ${
                        editForm.disponibilidad ? 'active' : ''
                      }`}
                      onClick={() =>
                        setEditForm({
                          ...editForm,
                          disponibilidad: !editForm.disponibilidad,
                        })
                      }
                    >
                      {editForm.disponibilidad ? 'Disponible' : 'No disponible'}
                    </button>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Imagen</label>
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

                  <button
                    type="submit"
                    className="admin-edit-save-btn"
                    disabled={submitting}
                  >
                    {submitting ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </form>
              ) : (
                /* Modo vista: muestra el producto con acciones */
                <div className="admin-product-row">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="admin-product-img"
                    />
                  )}
                  <div className="admin-product-info">
                    <h3 className="admin-product-name">{product.name}</h3>
                    <p className="admin-product-meta">
                      ${product.price} · Stock: {product.stock} ·{' '}
                      {product.category.join(', ')}
                    </p>
                  </div>

                  {/* Modo bulk: inputs inline de stock y disponibilidad */}
                  {bulkMode ? (
                    <div className="admin-bulk-fields">
                      <label className="admin-bulk-field">
                        <span className="admin-bulk-label">Stock</span>
                        <input
                          type="number"
                          className="form-input admin-bulk-input"
                          value={bulkEdits[product.id]?.stock ?? product.stock}
                          onChange={(e) =>
                            handleBulkChange(product.id, 'stock', e.target.value)
                          }
                          min="0"
                          disabled={submitting}
                        />
                      </label>
                      <label className="admin-bulk-field">
                        <span className="admin-bulk-label">Disp.</span>
                        <input
                          type="checkbox"
                          className="admin-bulk-checkbox"
                          checked={bulkEdits[product.id]?.disponibilidad ?? product.available}
                          onChange={(e) =>
                            handleBulkChange(product.id, 'disponibilidad', e.target.checked)
                          }
                          disabled={submitting}
                        />
                      </label>
                    </div>
                  ) : (
                    /* Modo normal: botones editar/eliminar */
                    <div className="admin-product-actions">
                      <button
                        className="admin-edit-btn"
                        onClick={() => startEdit(product)}
                        disabled={submitting}
                      >
                        Editar
                      </button>
                      <button
                        className="admin-delete-btn"
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={submitting}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminProducts;