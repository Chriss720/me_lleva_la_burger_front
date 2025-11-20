import api from './api';
import type { Product } from '../types';

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get('/all-products');
    return response.data.data || response.data || [];
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data.data || response.data;
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data.data || response.data || [];
  },

  createProduct: async (payload: Partial<Product>): Promise<Product> => {
    const response = await api.post('/products', payload);
    return response.data.data || response.data;
  },

  updateProduct: async (id: number, payload: Partial<Product>): Promise<Product> => {
    const response = await api.put(`/products/${id}`, payload);
    return response.data.data || response.data;
  },

  deleteProduct: async (id: number): Promise<{ success: boolean }> => {
    const response = await api.delete(`/products/${id}`);
    return response.data || { success: true };
  },
};
