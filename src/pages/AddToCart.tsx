import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { Layout } from '../components/layout/Layout';

export const AddToCart = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem, isAdding, loadMyCart } = useCart();
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
    loadMyCart().catch(() => { });
  }, [productId, isAuthenticated, navigate, loadMyCart]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    try {
      await addItem(product, quantity);
      // El refetchQueries en useCart ahora espera a que el carrito se actualice
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('No se pudo agregar al carrito');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <Layout>
      <div className="bg-black text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-oswald font-bold text-[#FFC72C] mb-8 uppercase border-b border-gray-800 pb-4">
            Personalizar Pedido
          </h2>

          {loading && !product ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFC72C] mx-auto mb-4"></div>
              <p className="text-gray-400">Cargando producto...</p>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-900 text-red-400 p-4 rounded-lg text-center">
              {error}
            </div>
          ) : product ? (
            <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-[#333] shadow-xl flex flex-col md:flex-row">
              <div className="md:w-1/2 h-64 md:h-auto bg-gray-800 relative">
                {product.imagen ? (
                  <img
                    src={product.imagen}
                    alt={product.nombre_producto}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    Sin imagen
                  </div>
                )}
              </div>

              <div className="p-8 md:w-1/2 flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl text-[#FFC72C] font-bold font-oswald mb-2 uppercase">{product.nombre_producto}</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">{product.descripcion}</p>
                  <div className="text-4xl font-bold text-white mb-8">${product.precio}</div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2 uppercase font-bold">Cantidad</label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full bg-[#333] text-white hover:bg-[#FFC72C] hover:text-black font-bold transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                        className="w-20 p-2 text-center bg-transparent text-2xl font-bold text-white border-b-2 border-[#FFC72C] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-full bg-[#333] text-white hover:bg-[#FFC72C] hover:text-black font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isAdding}
                    className="w-full bg-[#DA291C] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#a81f13] transition-all shadow-lg hover:shadow-red-900/20 uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAdding ? 'Agregando...' : 'Agregar al Pedido'}
                  </button>
                </form>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Layout>
  );
};
