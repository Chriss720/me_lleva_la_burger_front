import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import api from '../../services/api';

export const Dashboard = () => {
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, totalProducts: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        const data = res.data.data || res.data;
        setStats({
          totalOrders: data.totalOrders || 0,
          pendingOrders: data.pendingOrders || 0,
          totalProducts: data.totalProducts || 0,
        });
      } catch (err) {
        console.error('Error loading admin stats', err);
      }
    };

    loadStats();
  }, []);

  return (
    <AdminLayout>
      <div className="p-8">
        <h2 className="text-4xl font-extrabold text-[#FFC72C] mb-8">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1a1a1a] p-6 rounded-lg border-2 border-[#FFC72C]">
            <p className="text-gray-400 text-sm">Total de Pedidos</p>
            <p className="text-3xl font-extrabold text-[#FFC72C]">{stats.totalOrders}</p>
          </div>
          <div className="bg-[#1a1a1a] p-6 rounded-lg border-2 border-[#FFC72C]">
            <p className="text-gray-400 text-sm">Pedidos Pendientes</p>
            <p className="text-3xl font-extrabold text-[#DA291C]">{stats.pendingOrders}</p>
          </div>
          <div className="bg-[#1a1a1a] p-6 rounded-lg border-2 border-[#FFC72C]">
            <p className="text-gray-400 text-sm">Productos en Menú</p>
            <p className="text-3xl font-extrabold text-[#FFC72C]">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-lg border-2 border-[#FFC72C]">
          <h3 className="text-2xl font-bold text-[#FFC72C] mb-4">Accesos Rápidos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/admin/pedidos" className="bg-[#DA291C] text-white p-4 rounded-lg font-bold text-center hover:bg-[#a81f13]">Ver Pedidos</a>
            <a href="/admin/menu" className="bg-[#FFC72C] text-black p-4 rounded-lg font-bold text-center hover:bg-[#FFB700]">Gestionar Menú</a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
