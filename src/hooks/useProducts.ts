import { useState, useCallback, useEffect } from 'react';
import type { Product } from '../types';
import { productService } from '../services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading products');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const searchProducts = useCallback(async (query: string): Promise<Product[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.searchProducts(query);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error searching products');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    products,
    isLoading,
    error,
    loadProducts,
    searchProducts,
  };
};
