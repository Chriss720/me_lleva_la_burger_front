import api from './api';
import type { Product } from '../types';

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data.data || response.data || [];
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data.data || response.data;
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    // Backend doesn't support search, so we fetch all and filter client-side
    const response = await api.get('/products');
    const allProducts = response.data.data || response.data || [];
    if (!query) return allProducts;

    const lowerQuery = query.toLowerCase();
    return allProducts.filter((p: any) =>
      p.nombre?.toLowerCase().includes(lowerQuery) ||
      p.descripcion?.toLowerCase().includes(lowerQuery)
    );
  },

  createProduct: async (payload: Partial<Product>): Promise<Product> => {
    const response = await api.post('/products', payload);
    return response.data.data || response.data;
  },

  updateProduct: async (id: number, payload: Partial<Product>): Promise<Product> => {
    const response = await api.patch(`/products/${id}`, payload);
    return response.data.data || response.data;
  },

  deleteProduct: async (id: number): Promise<{ success: boolean }> => {
    const response = await api.delete(`/products/${id}`);
    return response.data || { success: true };
  },
};
