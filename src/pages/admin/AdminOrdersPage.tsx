import React, { useState, useEffect } from 'react';
import client from '../../api/client';

interface Order {
    id_pedido: number;
    fecha_pedido: string;
    estado: string;
    total: number;
    customer?: {
        nombre_cliente: string;
        apellido_cliente: string;
    };
}

const AdminOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await client.get('/orders');
            // Sort by ID descending
            const sortedOrders = (response.data || []).sort((a: Order, b: Order) => b.id_pedido - a.id_pedido);
            setOrders(sortedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch ((status || '').toLowerCase()) {
            case 'realizado':
            case 'completado': return 'bg-green-900 text-green-300 border border-green-700';
            case 'en camino': return 'bg-blue-900 text-blue-300 border border-blue-700';
            case 'pendiente': return 'bg-yellow-900 text-yellow-300 border border-yellow-700';
            case 'cancelado':
            case 'rechazado': return 'bg-red-900 text-red-300 border border-red-700';
            default: return 'bg-gray-700 text-gray-300';
        }
    };

    return (
        <div className="p-8 bg-black min-h-full text-white">
            <h1 className="text-4xl font-extrabold text-[#FFC72C] mb-8 font-oswald uppercase">Gestión de Pedidos</h1>

            <div className="bg-[#1a1a1a] rounded-lg border border-[#333] overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#222] border-b border-[#FFC72C]">
                                <th className="p-4 text-[#FFC72C] font-bold uppercase">ID Pedido</th>
                                <th className="p-4 text-[#FFC72C] font-bold uppercase">Cliente</th>
                                <th className="p-4 text-[#FFC72C] font-bold uppercase">Estado</th>
                                <th className="p-4 text-[#FFC72C] font-bold uppercase">Total</th>
                                <th className="p-4 text-[#FFC72C] font-bold uppercase">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-gray-400">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FFC72C] mx-auto mb-4"></div>
                                        Cargando pedidos...
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-gray-400">No hay pedidos registrados</td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id_pedido} className="border-b border-gray-800 hover:bg-[#222] transition-colors">
                                        <td className="p-4 font-bold font-mono text-lg">#{order.id_pedido}</td>
                                        <td className="p-4 text-gray-300">
                                            {order.customer ? `${order.customer.nombre_cliente} ${order.customer.apellido_cliente || ''}` : <span className="italic text-gray-500">Cliente General</span>}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(order.estado)}`}>
                                                {order.estado || 'Desconocido'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-[#FFC72C] font-bold">
                                            ${Number(order.total).toFixed(2)}
                                        </td>
                                        <td className="p-4 text-gray-400 text-sm">
                                            {new Date(order.fecha_pedido).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrdersPage;
