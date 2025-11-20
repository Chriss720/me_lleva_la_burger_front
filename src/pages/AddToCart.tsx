import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

export const AddToCart = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { loadMyCart, addItem } = useCart();
  const [product, setProduct] = useState<any | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const id = Number(productId);
    if (!id) {
      setError('Producto inválido');
      return;
    }

    setLoading(true);
    productService
      .getProductById(id)
      .then((p) => setProduct(p))
      .catch((e) => setError(e.message || 'Error cargando producto'))
      .finally(() => setLoading(false));

    // ensure cart is loaded
    loadMyCart().catch(() => {});
  }, [productId, isAuthenticated, navigate, loadMyCart]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setLoading(true);
    try {
      // use addItem helper (will call cartService.addToCart)
      await addItem(product, quantity);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('No se pudo agregar al carrito');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold text-[#FFC72C] mb-4">Agregar al carrito</h2>
      {loading && !product ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : product ? (
        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <div className="flex gap-6 items-center">
            <div className="w-40 h-40 bg-gray-700 flex items-center justify-center overflow-hidden rounded">
              {product.imagen ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.imagen} alt={product.nombre_producto} className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-500">Sin imagen</div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl text-[#FFC72C] font-bold">{product.nombre_producto}</h3>
              <p className="text-gray-300 mb-4">{product.descripcion}</p>
              <p className="text-[#FFC72C] font-bold text-lg mb-4">${product.precio}</p>

              <form onSubmit={handleSubmit} className="flex items-center gap-4">
                <label className="text-white">Cantidad</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className="w-20 p-2 rounded bg-[#111] text-white border border-gray-700"
                />
                <button type="submit" disabled={loading} className="bg-[#DA291C] text-white px-4 py-2 rounded-full font-bold">
                  {loading ? 'Agregando...' : 'Agregar al carrito'}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
