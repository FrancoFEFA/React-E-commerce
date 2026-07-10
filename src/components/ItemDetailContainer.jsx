/*
 * Componente contenedor para la vista de detalle de un producto
 * Lee el parámetro :itemId de la URL usando useParams()
 * Llama a la promesa getProductById para obtener los datos de un solo producto
 * Pasa el producto al componente presentacional ItemDetail
 */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../context/useProducts';
import ItemDetail from './ItemDetail';

const ItemDetailContainer = () => {
  // Estado para almacenar el producto individual obtenido
  const [product, setProduct] = useState(null);
  // Estado de carga mientras se espera la respuesta de la promesa
  const [loading, setLoading] = useState(true);
  // Estado de error si el producto no existe o falla la carga
  const [error, setError] = useState(null);

  // Extrae el parámetro itemId de la URL actual
  const { itemId } = useParams();

  // Método del contexto: devuelve una Promise (con caché) para conservar el flujo
  const { getProductByIdCached } = useProducts();

  /*
   * Efecto que se dispara cuando cambia itemId en la URL
   * Llama al método del contexto que cachea el producto
   *
   * La bandera cancelled previene una race condition (condición de carrera):
   * si el usuario hace clic en otro producto antes de que termine el setTimeout,
   * la respuesta de la primera promesa se ignora y no pisa el estado nuevo.
   */
  useEffect(() => {
    let cancelled = false;

    getProductByIdCached(itemId)
      .then((data) => {
        if (cancelled) return;
        // Si no se encuentra el producto, se marca como error
        if (!data) {
          setProduct(null);
          setError('Producto no encontrado.');
        } else {
          setProduct(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setProduct(null);
        setError('Ocurrió un error al cargar el producto.');
        console.error(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    /*
     * Cleanup del efecto: se ejecuta antes de que el efecto se vuelva a correr
     * o cuando el componente se desmonta. Al poner cancelled = true evitamos una
     * race condition: si el usuario cambia de producto antes de que la promesa
     * responda, la promesa vieja no sobrescribirá el estado del nuevo producto.
     */
    return () => {
      cancelled = true;
    };
  }, [itemId, getProductByIdCached]); // Dependencia: se re-ejecuta al cambiar el ID

  return (
    <div className="item-list-container">
      {/* Estado de carga mientras se resuelve la promesa */}
      {loading && (
        <div className="status-container">
          <p className="loading-text">Cargando producto...</p>
        </div>
      )}

      {/* Estado de error si el producto no existe o hubo un fallo */}
      {error && !loading && (
        <div className="status-container">
          <p className="error-text">{error}</p>
        </div>
      )}

      {/* Éxito: renderiza el detalle del producto con el contador embebido */}
      {!loading && !error && product && <ItemDetail product={product} />}
    </div>
  );
};

export default ItemDetailContainer;
