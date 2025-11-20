import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks';

interface Props {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: Props) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-black text-white font-oswald">
      <aside className="w-64 bg-[#1a1a1a] border-r-4 border-[#FFC72C] p-6">
        <h1 className="text-3xl font-extrabold text-[#FFC72C] mb-8">ADMIN</h1>

        <nav className="space-y-4">
          <Link to="/admin/dashboard" className="block px-4 py-2 rounded-lg bg-[#FFC72C] text-black font-bold hover:bg-[#FFB700]">Dashboard</Link>
          <Link to="/admin/pedidos" className="block px-4 py-2 rounded-lg text-white hover:bg-[#333] transition">Pedidos</Link>
          <Link to="/admin/menu" className="block px-4 py-2 rounded-lg text-white hover:bg-[#333] transition">Menú</Link>
          <Link to="/admin/ingredientes" className="block px-4 py-2 rounded-lg text-white hover:bg-[#333] transition">Ingredientes</Link>
          <Link to="/admin/empleados" className="block px-4 py-2 rounded-lg text-white hover:bg-[#333] transition">Empleados</Link>
        </nav>

        <div className="mt-12 pt-6 border-t border-gray-700">
          <p className="text-sm text-gray-400 mb-2">Sesión</p>
          <div className="text-sm mb-4">
            <p className="font-bold">{user?.nombre_cliente} {user?.apellido_cliente}</p>
            <p className="text-gray-400">{user?.correo_cliente || user?.email}</p>
          </div>
          <button onClick={() => { logout(); window.location.href='/login'; }} className="w-full bg-[#DA291C] text-white py-2 rounded-lg font-bold hover:bg-[#a81f13]">Cerrar sesión</button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};
