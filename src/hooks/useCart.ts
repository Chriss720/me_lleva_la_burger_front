import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../services/cartService';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';
import type { Cart, Product } from '../types';

export const useCart = () => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: cart, isLoading, isError } = useQuery<Cart>({
    queryKey: ['cart', user?.id],
    queryFn: () => cartService.getMyCart(user?.id || 0),
    enabled: !!isAuthenticated && !!user?.id,
    retry: 1,
  });

  const items = cart?.items || [];

  const addItemMutation = useMutation({
    mutationFn: async ({ product, quantity }: { product: Product; quantity: number }) => {
      let currentCartId = cart?.id;
      if (!currentCartId && user?.id) {
        const newCart = await cartService.getMyCart(user.id);
        currentCartId = newCart.id;
      }
      if (!currentCartId) throw new Error("No cart available");
      return cartService.addToCart(currentCartId, product.id_producto || product.id || 0, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (productId: number) => {
      if (!cart?.id) throw new Error("No cart found");
      return cartService.removeFromCart(cart.id, productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async (paymentMethod: string = 'Tarjeta') => {
      if (!cart?.id) throw new Error("No cart found");
      const order = await cartService.checkout(cart.id);

      if (order && order.id_pedido) {
        await paymentService.createPayment({
          id_pedido: order.id_pedido,
          metodo: paymentMethod,
          monto: order.total,
          estado: 'Completado'
        });
      }
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const getTotal = (): number => {
    return items.reduce((sum, item) => sum + (item.subtotal || item.cantidad * item.precio_unitario), 0);
  };

  const getItemCount = (): number => {
    return items.reduce((sum, item) => sum + item.cantidad, 0);
  };

  return {
    cart,
    items,
    isLoading,
    isError,
    addItem: (product: Product, quantity: number = 1) => addItemMutation.mutateAsync({ product, quantity }),
    removeItem: removeItemMutation.mutateAsync,
    checkout: checkoutMutation.mutateAsync,
    getTotal,
    getItemCount,
    loadMyCart: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    isAdding: addItemMutation.isPending,
    isRemoving: removeItemMutation.isPending,
    isCheckingOut: checkoutMutation.isPending,
  };
};
