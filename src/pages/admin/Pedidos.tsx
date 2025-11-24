import { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../../api/client';
import { orderService } from '../../services/orderService';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';

interface Order {
  id_pedido: number;
  estado: string;
  fecha_pedido: string;
  total: number;
  customer?: {
    nombre_cliente: string;
    apellido_cliente: string;
  };
}

export const PedidosAdmin = () => {
  // Fetch all orders
  const queryClient = useQueryClient();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (orderId: number) => orderService.deleteOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      setDeleteModalOpen(false);
      setOrderToDelete(null);
      setError(null);
    },
    onError: (err) => {
      console.error("Error deleting order:", err);
      setError("No se pudo eliminar el pedido. Intente nuevamente.");
    }
  });

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await client.get('/orders');
      return res.data.sort((a: Order, b: Order) => b.id_pedido - a.id_pedido);
    }
  });

  const handleDeleteClick = (orderId: number) => {
    setOrderToDelete(orderId);
    setDeleteModalOpen(true);
    setError(null);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      deleteMutation.mutate(orderToDelete);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'realizado':
        return 'bg-green-900 text-green-200 border border-green-700';
      case 'cancelado':
        return 'bg-red-900 text-red-200 border border-red-800';
      case 'en camino':
        return 'bg-blue-900 text-blue-200 border border-blue-700';
      case 'pendiente':
        return 'bg-[#DA291C] text-white border border-red-700';
      default:
        return 'bg-gray-700 text-gray-200 border border-gray-600';
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <h2 className="text-4xl font-extrabold text-[#FFC72C] mb-8">Gestión de Pedidos</h2>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-white p-4 rounded mb-6 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-white hover:text-gray-300">&times;</button>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFC72C] mx-auto"></div>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] rounded-lg border-2 border-[#FFC72C] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#222] border-b-2 border-[#FFC72C]">
                <tr>
                  <th className="p-4 text-left text-[#FFC72C] font-bold">ID Pedido</th>
                  <th className="p-4 text-left text-[#FFC72C] font-bold">Cliente</th>
                  <th className="p-4 text-left text-[#FFC72C] font-bold">Estado</th>
                  <th className="p-4 text-left text-[#FFC72C] font-bold">Total</th>
                  <th className="p-4 text-left text-[#FFC72C] font-bold">Fecha</th>
                  <th className="p-4 text-right text-[#FFC72C] font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id_pedido} className="hover:bg-[#252525] transition">
                      <td className="p-4 text-white">#{order.id_pedido}</td>
                      <td className="p-4 text-gray-300">
                        {order.customer
                          ? `${order.customer.nombre_cliente} ${order.customer.apellido_cliente}`
                          : 'Cliente desconocido'}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.estado)}`}>
                          {order.estado}
                        </span>
                      </td>
                      <td className="p-4 text-[#FFC72C] font-bold">${Number(order.total).toFixed(2)}</td>
                      <td className="p-4 text-gray-400 text-sm">
                        {new Date(order.fecha_pedido).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        {['realizado', 'cancelado'].includes((order.estado || '').toLowerCase()) && (
                          <button
                            onClick={() => handleDeleteClick(order.id_pedido)}
                            className="text-red-500 hover:text-red-400 hover:bg-red-900/20 p-2 rounded transition"
                            title="Eliminar pedido"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No hay pedidos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Pedido"
        message={`¿Estás seguro de que deseas eliminar el pedido #${orderToDelete}? Esta acción no se puede deshacer.`}
        isLoading={deleteMutation.isPending}
      />
    </AdminLayout>
  );
};
