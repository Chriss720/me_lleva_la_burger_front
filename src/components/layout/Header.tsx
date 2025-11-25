import { useState, useEffect } from 'react';
import { useAuth, useCart } from '../../hooks';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCartMenu, setShowCartMenu] = useState(false);
  const { getItemCount, items, getTotal, loadMyCart } = useCart();

  useEffect(() => {
    // Cuando el usuario inicia sesión, asegurarnos de cargar su carrito
    if (isAuthenticated) {
      loadMyCart().catch((e) => console.error('Error loading cart on auth change', e));
    }
  }, [isAuthenticated, loadMyCart]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  console.log('User object in Header:', user); // For debugging

  const getUserName = () => {
    if (!user) return 'Acceder';

    const firstName = user.nombre_cliente || user.nombre;
    const lastName = user.apellido_cliente || user.apellido || '';

    if (firstName) {
      return `${firstName} ${lastName}`.trim();
    }

    return 'Usuario';
  };

  return (
    <header className="bg-black border-b-4 border-[#FFC72C] px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <a href="/" className="text-4xl font-extrabold text-[#FFC72C] no-underline flex items-center gap-2">
        <img src="/static/images/logo.png" alt="Logo" className="h-12 w-auto" />
        ME LLEVA LA BURGER
      </a>

      <nav>
        <ul className="flex gap-6 list-none">
          <li>
            <a href="/" className="text-white text-lg font-normal no-underline pb-1 hover:text-[#FFC72C]">
              Menú
            </a>
          </li>
          <li>
            <a href="/contacto" className="text-white text-lg font-normal no-underline pb-1 hover:text-[#FFC72C]">
              Contacto
            </a>
          </li>
          <li>
            <a href="/ubicacion" className="text-white text-lg font-normal no-underline pb-1 hover:text-[#FFC72C]">
              Ubicación
            </a>
          </li>
        </ul>
      </nav>

      <div className="flex items-center gap-4 relative">
        {/* Carrito */}
        <button
          onClick={() => setShowCartMenu(!showCartMenu)}
          className="flex items-center gap-2 text-white text-lg font-bold hover:text-[#FFC72C] relative bg-transparent border-0 cursor-pointer"
        >
          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
          <span id="carrito-count" className="absolute -top-2 -right-2 bg-[#DA291C] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {getItemCount ? getItemCount() : items.length}
          </span>
        </button>

        {/* Usuario */}
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 text-white text-lg font-bold hover:text-[#FFC72C] bg-transparent border-0 cursor-pointer"
        >
          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <span id="usuario-nombre">{isAuthenticated ? getUserName() : 'Acceder'}</span>
        </button>
      </div>

      {/* User Menu Dropdown */}
      {showUserMenu && isAuthenticated && user && (
        <div className="bg-[#1a1a1a] text-white rounded-lg p-4 shadow-lg w-64 absolute top-20 right-0 z-40">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center justify-center bg-gray-700 rounded-full w-12 h-12">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">
                {getUserName()}
              </p>
              <p className="text-sm text-gray-300">{user.correo_cliente || user.email}</p>
            </div>
          </div>
          <hr className="border-gray-700 my-2" />
          <button
            onClick={handleLogout}
            className="w-full bg-[#DA291C] text-white py-2 rounded-full font-bold hover:bg-[#a81f13]"
          >
            Cerrar sesión
          </button>
        </div>
      )}

      {/* Login Link */}
      {!isAuthenticated && showUserMenu && (
        <div className="bg-[#1a1a1a] text-white rounded-lg p-4 shadow-lg w-64 absolute top-20 right-0 z-40">
          <a href="/login" className="text-white text-lg font-bold hover:text-[#FFC72C] block py-2">
            Ir a Iniciar sesión
          </a>
          <a href="/register" className="text-white text-lg font-bold hover:text-[#FFC72C] block py-2">
            Registrarse
          </a>
        </div>
      )}

      {/* Cart Menu Dropdown */}
      {showCartMenu && (
        <div className="bg-[#1a1a1a] text-white rounded-lg p-4 shadow-lg w-80 max-h-96 overflow-y-auto absolute top-20 right-24 z-40">
          <h3 className="font-bold text-lg mb-3 text-[#FFC72C]">Mi Carrito</h3>
          <div className="space-y-3 mb-3">
            {items && items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-[#111] p-2 rounded">
                  <div>
                    <p className="font-bold">{item.producto?.nombre_producto || 'Producto sin nombre'}</p>
                    <p className="text-sm text-gray-300">Cantidad: {item.cantidad}</p>
                  </div>
                  <div className="text-[#FFC72C] font-bold">${((item.cantidad || 1) * (item.precio_unitario || item.producto?.precio || 0)).toFixed(2)}</div>
                </div>
              ))
            ) : (
              <p className="text-gray-300 text-center py-4">Tu carrito está vacío</p>
            )}
          </div>
          <hr className="border-gray-700 my-2" />
          <div className="mb-2">
            <p className="text-sm text-gray-300">Total:</p>
            <p className="text-[#FFC72C] font-bold text-xl">${getTotal().toFixed(2)}</p>
          </div>
          <button onClick={() => window.location.href = '/checkout'} className="w-full bg-[#DA291C] text-white py-2 rounded-full font-bold hover:bg-[#a81f13]">
            Procesar Pago
          </button>
        </div>
      )}
    </header>
  );
};
