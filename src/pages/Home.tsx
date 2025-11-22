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
      <section className="py-24 px-8 md:px-12 bg-black text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 w-full">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl uppercase text-[#FFC72C] leading-none mb-6 font-oswald font-bold tracking-tighter">
              ¿Listo para tu próxima Burger?
            </h1>
            <p className="text-xl text-gray-300 max-w-xl mx-auto md:mx-0 mb-10 leading-relaxed">
              Hechas a la parrilla, con ingredientes frescos y un sabor que te transporta a otro nivel.
            </p>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <img
              src="/static/images/tiburon.png"
              alt="Hamburguesa Tiburón"
              className="max-w-full h-auto rounded-2xl shadow-[0_0_50px_20px_rgba(255,199,44,0.15)] transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Productos */}
      <section className="py-20 px-8 md:px-12 bg-[#111]">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-800 pb-6">
            <h2 className="text-4xl md:text-5xl uppercase text-[#FFC72C] font-bold text-center md:text-left">Nuestro Menú</h2>
            <p className="text-gray-400 mt-4 md:mt-0">Las mejores burgers de la ciudad</p>
          </div>

          {productsLoading ? (
            <div className="text-center py-24">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FFC72C] mx-auto mb-4"></div>
              <p className="text-white text-xl">Cargando productos...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 xl:gap-14">
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
                <div className="flex justify-center mt-16 mb-12">
                  <button
                    onClick={() => setShowAllProducts(true)}
                    className="bg-[#FFC72C] text-black text-lg px-10 py-4 rounded-full font-bold hover:bg-yellow-400 hover:scale-105 transition-all shadow-lg hover:shadow-yellow-500/20"
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
        <section className="py-20 px-8 md:px-12 bg-[#151515]">
          <div className="max-w-7xl mx-auto w-full">
            <h2 className="text-4xl uppercase text-[#FFC72C] mb-12 font-bold border-b border-gray-800 pb-6">Mis Compras</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Carrito */}
              <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#333] shadow-xl">
                <h3 className="text-2xl text-[#FFC72C] mb-6 flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Mi Carrito
                </h3>
                {cartItems.length > 0 ? (
                  <>
                    <div className="space-y-6 mb-8">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center border-b border-gray-700 pb-4 last:border-0">
                          <div>
                            <p className="text-white font-bold text-lg">{item.producto?.nombre_producto}</p>
                            <p className="text-gray-400">Cantidad: {item.cantidad}</p>
                          </div>
                          <p className="text-[#FFC72C] font-bold text-xl">${(item.cantidad * item.precio_unitario).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-[#222] rounded-xl p-6 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-lg">Total a pagar:</span>
                        <span className="text-[#FFC72C] font-bold text-3xl">${getTotal().toFixed(2)}</span>
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
                      className="w-full bg-[#DA291C] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#a81f13] transition-all shadow-lg hover:shadow-red-900/20"
                    >
                      Procesar Pago
                    </button>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
                  </div>
                )}
              </div>

              {/* Pedidos */}
              <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#333] shadow-xl">
                <h3 className="text-2xl text-[#FFC72C] mb-6 flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Mis Pedidos
                </h3>
                {ordersLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FFC72C] mx-auto mb-4"></div>
                    <p className="text-gray-400">Cargando pedidos...</p>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-[#252525] rounded-xl p-5 border-l-4 border-[#FFC72C] hover:bg-[#2a2a2a] transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-white font-bold text-lg">Pedido #{order.numero_orden || order.id}</p>
                            <p className="text-gray-400 text-sm">{order.fecha_pedido}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.estado === 'Completado' ? 'bg-green-900 text-green-300' :
                            order.estado === 'Pendiente' ? 'bg-yellow-900 text-yellow-300' :
                              'bg-gray-700 text-gray-300'
                            }`}>
                            {order.estado}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-700">
                          <span className="text-gray-400 text-sm">Total</span>
                          <p className="text-[#FFC72C] font-bold text-lg">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No tienes pedidos aún</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Mensaje si no está autenticado */}
      {!isAuthenticated && (
        <section className="py-24 px-8">
          <div className="max-w-4xl mx-auto bg-[#1a1a1a] rounded-2xl p-16 text-center border border-[#FFC72C] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-2 bg-[#FFC72C]"></div>
            <svg viewBox="0 0 24 24" className="w-24 h-24 fill-[#FFC72C] mx-auto mb-8 transform group-hover:scale-110 transition-transform duration-500">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
            <h2 className="text-4xl md:text-5xl text-white mb-6 font-bold font-oswald uppercase tracking-tight">¿Listo para ordenar?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Debes acceder a tu cuenta para ver tu carrito y tus pedidos. ¡Inicia sesión o crea una cuenta ahora para disfrutar de las mejores burgers!
            </p>
            <a
              href="/login"
              className="inline-block bg-[#FFC72C] text-black px-10 py-4 rounded-full font-bold text-xl hover:bg-yellow-400 hover:scale-105 transition-all shadow-lg hover:shadow-yellow-500/20"
            >
              Acceder Ahora
            </a>
          </div>
        </section>
      )}

      {/* Sección Sobre Nosotros */}
      {/* Sección Sobre Nosotros */}
      <section className="py-24 px-8 bg-[#111] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFC72C] to-transparent opacity-50"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl uppercase text-[#FFC72C] mb-8 font-bold">Nuestra Historia</h2>
          <p className="text-xl text-gray-300 leading-loose font-light">
            En <span className="text-white font-bold">Me Lleva la Burger</span>, nos apasiona crear las hamburguesas más deliciosas y jugosas. Desde nuestros inicios,
            nos hemos comprometido a usar solo los ingredientes más frescos y de la más alta calidad, cocinados a la
            perfección en nuestra parrilla. ¡Ven y descubre por qué somos la mejor opción para tu antojo de burger!
          </p>
        </div>
      </section>

      {/* Testimonios */}
      {/* Testimonios */}
      <section className="py-24 px-8 md:px-12 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl uppercase text-[#FFC72C] mb-24 font-bold text-center">Lo que Dicen Nuestros Clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
            <div className="bg-[#1a1a1a] rounded-2xl p-10 border border-[#333] relative">
              <div className="absolute -top-6 left-10 bg-[#FFC72C] text-black p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-300 mb-6 italic text-lg leading-relaxed">
                "¡La mejor hamburguesa que he probado en mi vida! El sabor ahumado es increíble y la carne siempre está
                en su punto."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-[#FFC72C] font-bold text-xl">J</div>
                <div>
                  <p className="text-white font-bold text-lg">Juan Pérez</p>
                  <div className="flex text-[#FFC72C]">★★★★★</div>
                </div>
              </div>
            </div>
            <div className="bg-[#1a1a1a] rounded-2xl p-10 border border-[#333] relative">
              <div className="absolute -top-6 left-10 bg-[#FFC72C] text-black p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-300 mb-6 italic text-lg leading-relaxed">
                "Siempre pido aquí cuando quiero una buena burger. La entrega es rápida y la calidad nunca decepciona."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-[#FFC72C] font-bold text-xl">M</div>
                <div>
                  <p className="text-white font-bold text-lg">María García</p>
                  <div className="flex text-[#FFC72C]">★★★★★</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
