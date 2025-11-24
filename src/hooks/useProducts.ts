import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Product } from '../types';
import { productService } from '../services/productService';

export const useProducts = () => {
  const queryClient = useQueryClient();

  const {
    data: products = [],
    isLoading,
    error,
    refetch: loadProducts,
  } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAllProducts,
  });

  const createProductMutation = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) =>
      productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const searchProducts = useCallback(async (query: string): Promise<Product[]> => {
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
    createProduct: createProductMutation.mutateAsync,
    updateProduct: updateProductMutation.mutateAsync,
    deleteProduct: deleteProductMutation.mutateAsync,
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
  };
};
