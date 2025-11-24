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
    const response = await api.get('/orders/my-orders');
    return response.data.data || response.data || [];
  },

  createOrder: async (orderData: any): Promise<Order> => {
    const response = await api.post('/orders', orderData);
    return response.data.data || response.data;
  },

  updateOrderStatus: async (orderId: number, status: string): Promise<Order> => {
    const response = await api.patch(`/orders/${orderId}`, { estado: status });
    return response.data.data || response.data;
  },
  deleteOrder: async (orderId: number): Promise<void> => {
    await api.delete(`/orders/${orderId}`);
  },
};
