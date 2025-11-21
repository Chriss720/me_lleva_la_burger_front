import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useProducts } from '../hooks/useProducts';
import { Layout } from '../components/layout/Layout';
import { ProductCard } from '../components/common/ProductCard';
import type { Product, Order } from '../types';
import { orderService } from '../services/orderService';

export const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const { products, isLoading: productsLoading } = useProducts();
  const { items: cartItems, getTotal, loadMyCart, checkout } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);

  // Cargar órdenes del usuario
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      setOrdersLoading(true);
      orderService
        .getOrdersByCustomer(user.id)
        .then(setOrders)
        .catch(console.error)
        .finally(() => setOrdersLoading(false));
    }
  }, [isAuthenticated, user?.id]);

  const handleAddToCart = async (product: Product) => {
    // navigate to add-to-cart page so user can select quantity
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const pid = (product as any).id || (product as any).id_producto;
    navigate(`/carts/add/${pid}`);
  };

  // ensure cart is loaded when authenticated so we can show in-cart status
  useEffect(() => {
    if (isAuthenticated) {
      loadMyCart().catch((e) => console.error('Error loading cart', e));
    }
  }, [isAuthenticated, loadMyCart]);

  const displayedProducts = showAllProducts ? products : products.slice(0, 6);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 px-8 md:px-12 bg-black text-white">
        <div className="flex flex-col md:flex-row items-center gap-16 w-full">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl uppercase text-[#FFC72C] leading-tight mb-4 font-oswald font-bold">
              ¿Listo para tu próxima Burger?
            </h1>
            <p className="text-lg max-w-xl mx-auto md:mx-0 mb-8">
              Hechas a la parrilla, con ingredientes frescos y un sabor que te transporta a otro nivel.
            </p>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <img
              src="/static/images/tiburon.png"
              alt="Hamburguesa Tiburón"
              className="max-w-full h-auto rounded-xl shadow-[0_0_30px_15px_rgba(0,0,0,0.7)]"
            />
          </div>
        </div>
      </section>

      {/* Productos */}
      <section className="py-12 px-8 md:px-12">
        <div className="w-full">
          <h2 className="text-3xl uppercase text-[#FFC72C] mb-8 font-bold text-center md:text-left">Nuestro Menú</h2>
          {productsLoading ? (
            <div className="text-center py-12">
              <p className="text-white">Cargando productos...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                {displayedProducts.map((product) => {
                  const pid = (product as any).id || (product as any).id_producto;
                  const inCartItem = cartItems.find((it) => (it.producto?.id || (it.producto as any)?.id_producto) === pid);
                  const inCartCount = inCartItem ? inCartItem.cantidad : 0;
                  return (
                    <ProductCard
                      key={pid}
                      product={product}
                      onAddToCart={handleAddToCart}
                      isLoading={false}
                      inCartCount={inCartCount}
                    />
                  );
                })}
              </div>
              {!showAllProducts && products.length > 6 && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setShowAllProducts(true)}
                    className="bg-[#FFC72C] text-black px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors"
                  >
                    Mostrar menú completo
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Sección de Carrito y Pedidos */}
      {isAuthenticated && user && (
        <section className="py-20 px-8 md:px-12">
          <div className="w-full">
            <h2 className="text-4xl uppercase text-[#FFC72C] mb-8 font-bold">Mis Compras</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Carrito */}
              <div className="bg-[#1a1a1a] rounded-xl p-6 border-2 border-[#FFC72C]">
                <h3 className="text-2xl text-[#FFC72C] mb-4">Mi Carrito</h3>
                {cartItems.length > 0 ? (
                  <>
                    <div className="space-y-4 mb-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center border-b border-gray-600 pb-2">
                          <div>
                            <p className="text-white font-bold">{item.producto?.nombre_producto}</p>
                            <p className="text-gray-300 text-sm">Cantidad: {item.cantidad}</p>
                          </div>
                          <p className="text-[#FFC72C] font-bold">${(item.cantidad * item.precio_unitario).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-[#FFC72C] pt-4 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-bold">Total:</span>
                        <span className="text-[#FFC72C] font-bold text-xl">${getTotal().toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          const res = await checkout();
                          // optionally, you can show a confirmation to the user
                          if (res) {
                            window.alert('Pago procesado correctamente.');
                            // reload orders
                            if (user?.id) {
                              setOrdersLoading(true);
                              orderService
                                .getOrdersByCustomer(user.id)
                                .then(setOrders)
                                .catch(console.error)
                                .finally(() => setOrdersLoading(false));
                            }
                          }
                        } catch (err) {
                          console.error('Error during checkout:', err);
                          window.alert('Ocurrió un error al procesar el pago. Intenta nuevamente.');
                        }
                      }}
                      className="w-full bg-[#DA291C] text-white py-3 rounded-full font-bold hover:bg-[#a81f13] transition-colors"
                    >
                      Procesar Pago
                    </button>
                  </>
                ) : (
                  <p className="text-gray-300 text-center py-8">Tu carrito está vacío</p>
                )}
              </div>

              {/* Pedidos */}
              <div className="bg-[#1a1a1a] rounded-xl p-6 border-2 border-[#FFC72C]">
                <h3 className="text-2xl text-[#FFC72C] mb-4">Mis Pedidos</h3>
                {ordersLoading ? (
                  <p className="text-gray-300 text-center py-8">Cargando pedidos...</p>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-[#2a2a2a] rounded-lg p-4 border-l-4 border-[#FFC72C]">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-white font-bold">Pedido #{order.numero_orden || order.id}</p>
                          <span className="bg-[#FFC72C] text-black px-2 py-1 rounded text-xs font-bold">{order.estado}</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{order.fecha_pedido}</p>
                        <p className="text-[#FFC72C] font-bold">${order.total.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-300 text-center py-8">No tienes pedidos aún</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Mensaje si no está autenticado */}
      {!isAuthenticated && (
        <section className="py-16 px-8">
          <div className="max-w-2xl mx-auto bg-[#1a1a1a] rounded-xl p-12 text-center border-2 border-[#FFC72C]">
            <svg viewBox="0 0 24 24" className="w-20 h-20 fill-[#FFC72C] mx-auto mb-4">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
            <h2 className="text-3xl text-white mb-3 font-bold">¿Listo para ordenar?</h2>
            <p className="text-lg text-gray-300 mb-6">
              Debes acceder a tu cuenta para ver tu carrito y tus pedidos. ¡Inicia sesión o crea una cuenta ahora!
            </p>
            <a
              href="/login"
              className="inline-block bg-[#FFC72C] text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors"
            >
              Acceder Ahora
            </a>
          </div>
        </section>
      )}

      {/* Sección Sobre Nosotros */}
      <section className="py-16 px-8 border-t-4 border-[#FFC72C]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl uppercase text-[#FFC72C] mb-6 font-bold">Nuestra Historia</h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            En Me Lleva la Burger, nos apasiona crear las hamburguesas más deliciosas y jugosas. Desde nuestros inicios,
            nos hemos comprometido a usar solo los ingredientes más frescos y de la más alta calidad, cocinados a la
            perfección en nuestra parrilla. ¡Ven y descubre por qué somos la mejor opción para tu antojo de burger!
          </p>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl uppercase text-[#FFC72C] mb-12 font-bold text-center">Lo que Dicen Nuestros Clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#1a1a1a] rounded-lg p-6 border-l-4 border-[#FFC72C]">
              <p className="text-gray-300 mb-4 italic">
                "¡La mejor hamburguesa que he probado en mi vida! El sabor ahumado es increíble y la carne siempre está
                en su punto."
              </p>
              <p className="text-[#FFC72C] font-bold">— Juan Pérez</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-6 border-l-4 border-[#FFC72C]">
              <p className="text-gray-300 mb-4 italic">
                "Siempre pido aquí cuando quiero una buena burger. La entrega es rápida y la calidad nunca decepciona."
              </p>
              <p className="text-[#FFC72C] font-bold">— María García</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
