import { AdminLayout } from '../../components/admin/AdminLayout';
import { orderService } from '../../services/orderService';
import { useEffect, useState } from 'react';
import type { Order } from '../../types';

export const PedidosAdmin = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    orderService.getMyOrders().then(setOrders).catch(console.error);
  }, []);

  return (
    <AdminLayout>
      <div className="p-8">
        <h2 className="text-4xl font-extrabold text-[#FFC72C] mb-8">Gestión de Pedidos</h2>

        <div className="bg-[#1a1a1a] p-6 rounded-lg border-2 border-[#FFC72C] overflow-x-auto">
          <table className="w-full">
            <thead className="border-b-2 border-[#FFC72C]">
              <tr>
                <th className="text-left py-2 text-[#FFC72C] font-bold">ID Pedido</th>
                <th className="text-left py-2 text-[#FFC72C] font-bold">Cliente</th>
                <th className="text-left py-2 text-[#FFC72C] font-bold">Estado</th>
                <th className="text-left py-2 text-[#FFC72C] font-bold">Fecha</th>
                <th className="text-left py-2 text-[#FFC72C] font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-700 hover:bg-[#222] transition">
                    <td className="py-3">#{order.id}</td>
                    <td className="py-3">{order.items && order.items.length > 0 ? order.items[0].producto?.nombre_producto : 'N/A'}</td>
                    <td className="py-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${order.estado === 'completado' ? 'bg-green-900 text-green-200' : order.estado === 'pendiente' ? 'bg-[#DA291C] text-white' : 'bg-gray-700 text-gray-200'}`}>
                        {order.estado || 'Desconocido'}
                      </span>
                    </td>
                    <td className="py-3">{order.fecha_pedido}</td>
                    <td className="py-3">
                      <button className="bg-[#FFC72C] text-black px-3 py-1 rounded font-bold hover:bg-[#FFB700]">Ver</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">No hay pedidos</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
