import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

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

const StaffOrdersPage: React.FC = () => {
    const { user, logout } = useAuth();
    const queryClient = useQueryClient();

    // Fetch orders with polling
    const { data: orders = [], isLoading } = useQuery<Order[]>({
        queryKey: ['orders'],
        queryFn: async () => {
            const res = await client.get('/orders');
            // Ordenar por ID descendente (más recientes primero)
            return res.data.sort((a: Order, b: Order) => b.id_pedido - a.id_pedido);
        },
        refetchInterval: 5000, // Polling más rápido (5s) para "En vivo"
    });

    // Mutation for updating status
    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: number; status: string }) => {
            await client.patch(`/orders/${id}/status`, { estado: status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
        onError: () => {
            alert('Error al actualizar el estado del pedido');
        }
    });

    const handleStatusChange = (id: number, status: string) => {
        updateStatusMutation.mutate({ id, status });
    };

    // Filtrar pedidos activos (Pendiente, En camino) vs Historial (Realizado, Cancelado)
    const activeOrders = orders.filter(o =>
        ['pendiente', 'en camino', 'preparando'].includes((o.estado || '').toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'realizado': return 'bg-green-900 text-green-200 border border-green-700';
            case 'en camino': return 'bg-blue-900 text-blue-200 border border-blue-700 animate-pulse';
            case 'pendiente': return 'bg-[#DA291C] text-white border border-red-700 animate-pulse';
            case 'cancelado': return 'bg-red-900 text-red-200 border border-red-800';
            default: return 'bg-gray-700 text-gray-200 border border-gray-600';
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            {/* Header Staff */}
            <header className="bg-[#1a1a1a] border-b-2 border-[#FFC72C] p-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-[#FFC72C] font-oswald">STAFF / PEDIDOS</h1>
                    <span className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-xs border border-green-700 animate-pulse">En vivo</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-gray-300 hidden sm:inline">Hola, {user?.nombre}</span>
                    <button onClick={logout} className="text-sm text-red-400 hover:text-red-300 border border-red-900 px-3 py-1 rounded hover:bg-red-900/20 transition">
                        Salir
                    </button>
                </div>
            </header>

            <div className="p-4 sm:p-8">
                <div className="flex flex-col items-center justify-center mb-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FFC72C] mb-4 font-oswald tracking-wider">PEDIDOS EN CALIENTE</h2>
                    <div className="flex flex-col items-center justify-center gap-4">
                        <img src="/images/rem.png" alt="Staff" className="h-48 object-contain opacity-90 hover:scale-105 transition-transform duration-300" />
                        <p className="text-gray-300 text-lg font-medium">Bienvenido mi amor, listo para chambear</p>
                    </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-lg border-2 border-[#FFC72C] overflow-hidden shadow-2xl shadow-[#FFC72C]/10">
                    {isLoading ? (
                        <div className="p-12 text-center text-gray-400">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFC72C] mx-auto mb-4"></div>
                            Cargando pedidos...
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#222] border-b-2 border-[#FFC72C]">
                                    <tr>
                                        <th className="p-4 text-[#FFC72C] font-bold">ID</th>
                                        <th className="p-4 text-[#FFC72C] font-bold">Cliente</th>
                                        <th className="p-4 text-[#FFC72C] font-bold">Estado</th>
                                        <th className="p-4 text-[#FFC72C] font-bold">Total</th>
                                        <th className="p-4 text-[#FFC72C] font-bold">Fecha</th>
                                        <th className="p-4 text-[#FFC72C] font-bold text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {activeOrders.length > 0 ? (
                                        activeOrders.map((order) => (
                                            <tr key={order.id_pedido} className="hover:bg-[#252525] transition group">
                                                <td className="p-4 font-mono text-lg">#{order.id_pedido}</td>
                                                <td className="p-4 font-medium text-gray-300">
                                                    {order.customer ? `${order.customer.nombre_cliente} ${order.customer.apellido_cliente || ''}` : <span className="text-gray-600 italic">Anónimo</span>}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(order.estado || '')}`}>
                                                        {order.estado || 'Desconocido'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-[#FFC72C] font-bold">
                                                    ${Number(order.total).toFixed(2)}
                                                </td>
                                                <td className="p-4 text-gray-500 text-sm">
                                                    {new Date(order.fecha_pedido).toLocaleString()}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {(order.estado || '').toLowerCase() === 'pendiente' && (
                                                            <button
                                                                onClick={() => handleStatusChange(order.id_pedido, 'En camino')}
                                                                disabled={updateStatusMutation.isPending}
                                                                className="bg-blue-700 text-white px-4 py-2 rounded font-bold text-sm hover:bg-blue-600 transition shadow-lg shadow-blue-900/50"
                                                            >
                                                                🛵 En camino
                                                            </button>
                                                        )}
                                                        {['pendiente', 'en camino'].includes((order.estado || '').toLowerCase()) && (
                                                            <button
                                                                onClick={() => handleStatusChange(order.id_pedido, 'Realizado')}
                                                                disabled={updateStatusMutation.isPending}
                                                                className="bg-green-700 text-white px-4 py-2 rounded font-bold text-sm hover:bg-green-600 transition shadow-lg shadow-green-900/50"
                                                            >
                                                                ✓ Realizado
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={async () => {
                                                                const result = await Swal.fire({
                                                                    title: '¿Cancelar este pedido?',
                                                                    text: 'Esta acción no se puede deshacer',
                                                                    icon: 'warning',
                                                                    showCancelButton: true,
                                                                    confirmButtonColor: '#DA291C',
                                                                    cancelButtonColor: '#666',
                                                                    confirmButtonText: 'Sí, cancelar',
                                                                    cancelButtonText: 'No',
                                                                    background: '#1a1a1a',
                                                                    color: '#fff',
                                                                    customClass: {
                                                                        popup: 'border-2 border-[#FFC72C]'
                                                                    }
                                                                });
                                                                if (result.isConfirmed) {
                                                                    handleStatusChange(order.id_pedido, 'Cancelado');
                                                                }
                                                            }}
                                                            disabled={updateStatusMutation.isPending}
                                                            className="bg-red-900/50 text-red-300 border border-red-800 px-3 py-2 rounded font-bold text-sm hover:bg-red-900 hover:text-white transition"
                                                        >
                                                            ✕ Cancelar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="text-center py-12 text-gray-500">
                                                <p className="text-xl">No hay pedidos pendientes</p>
                                                <p className="text-sm mt-2">¡Todo tranquilo por ahora!</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffOrdersPage;
