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

  return {
    products,
    isLoading,
    error: error ? (error as Error).message : null,
    loadProducts,
    createProduct: createProductMutation.mutateAsync,
    updateProduct: updateProductMutation.mutateAsync,
    deleteProduct: deleteProductMutation.mutateAsync,
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
  };
};

export const useProduct = (productId: number) => {
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: () => productService.getProductById(productId),
    enabled: !!productId,
  });

  return {
    product,
    isLoading,
    error: error ? (error as Error).message : null,
  };
};

export const useSearchProducts = (query: string) => {
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['products', 'search', query],
    queryFn: () => productService.searchProducts(query),
    enabled: query.length > 0,
  });

  return {
    products,
    isLoading,
    error: error ? (error as Error).message : null,
  };
};
