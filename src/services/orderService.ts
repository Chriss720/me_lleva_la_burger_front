import api from './api';
import type { Order } from '../types';

export const orderService = {
  getOrdersByCustomer: async (customerId: number): Promise<Order[]> => {
    const response = await api.get(`/orders/customer/${customerId}`);
    return response.data.data || response.data || [];
  },

  getOrderById: async (orderId: number): Promise<Order> => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data.data || response.data;
  },

  getMyOrders: async (): Promise<Order[]> => {
    const userStr = localStorage.getItem('clienteActual');
    if (!userStr) throw new Error('No active session');
    const user = JSON.parse(userStr);
    const userId = user.id || user.id_cliente || user.sub;

    const response = await api.get(`/orders/customer/${userId}`);
    return response.data.data || response.data || [];
  },

  createOrder: async (orderData: any): Promise<Order> => {
    const response = await api.post('/orders', orderData);
    return response.data.data || response.data;
  },

  updateOrderStatus: async (orderId: number, status: string): Promise<Order> => {
    const response = await api.patch(`/orders/${orderId}/status`, { estado: status });
    return response.data.data || response.data;
  },
};
