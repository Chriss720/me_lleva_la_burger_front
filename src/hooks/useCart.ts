import { useState, useCallback } from 'react';
import type { Cart, CartItem, Product } from '../types';
import { cartService } from '../services/cartService';

export const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCart = useCallback(async (cartId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await cartService.getCart(cartId);
      setCart(data);
      setItems(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading cart');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMyCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await cartService.getMyCart();
      setCart(data);
      setItems(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading cart');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addItem = useCallback(async (product: Product, quantity: number = 1) => {
    if (!cart) {
      setError('Cart not loaded');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const updated = await cartService.addToCart(cart.id, product.id || product.id_producto!, quantity);
      setCart(updated);
      setItems(updated.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding item');
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  const removeItem = useCallback(async (productId: number) => {
    if (!cart) {
      setError('Cart not loaded');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const updated = await cartService.removeFromCart(cart.id, productId);
      setCart(updated);
      setItems(updated.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error removing item');
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  const checkout = useCallback(async () => {
    if (!cart) {
      setError('Cart not loaded');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await cartService.checkout(cart.id);
      setCart(null);
      setItems([]);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error during checkout');
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

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
    error,
    loadCart,
    loadMyCart,
    addItem,
    removeItem,
    checkout,
    getTotal,
    getItemCount,
  };
};
