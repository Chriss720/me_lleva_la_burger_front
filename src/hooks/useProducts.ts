import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Product } from '../types';
import { productService } from '../services/productService';

export const useProducts = () => {
  const {
    data: products = [],
    isLoading,
    error,
    refetch: loadProducts,
  } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAllProducts,
  });

  const searchProducts = useCallback(async (query: string): Promise<Product[]> => {
    // For search, we might want to keep it manual or use a separate query.
    // Keeping it manual for now as it returns a promise directly which might be expected by the UI
    // or we could refactor this later to be a query too.
    try {
      const data = await productService.searchProducts(query);
      return data;
    } catch (err) {
      console.error(err);
      return [];
    }
  }, []);

  return {
    products,
    isLoading,
    error: error ? (error as Error).message : null,
    loadProducts,
    searchProducts,
  };
};
