import api from './api';
import type { Cart, CartItem } from '../types';

export const cartService = {
  getCart: async (cartId: number): Promise<Cart> => {
    const response = await api.get(`/carts/${cartId}`);
    const payload = response.data.data || response.data;
    return normalizeCart(payload);
  },

  getMyCart: async (): Promise<Cart> => {
    const response = await api.get('/carts/me');
    let payload = response.data.data || response.data;
    // backend may return an array of carts for the customer; return the first one
    if (Array.isArray(payload)) {
      payload = payload[0];
    }
    return normalizeCart(payload);
  },

  addToCart: async (cartId: number, productId: number, cantidad?: number): Promise<Cart> => {
    const response = await api.post(`/carts/${cartId}/add`, {
      id_producto: productId,
      cantidad: cantidad || 1,
    });
    const payload = response.data.data || response.data;
    return normalizeCart(payload);
  },

  removeFromCart: async (cartId: number, productId: number): Promise<Cart> => {
    const response = await api.post(`/carts/${cartId}/remove`, {
      id_producto: productId,
    });
    const payload = response.data.data || response.data;
    return normalizeCart(payload);
  },

  updateCart: async (cartId: number, items: CartItem[]): Promise<Cart> => {
    const response = await api.put(`/carts/${cartId}`, { items });
    const payload = response.data.data || response.data;
    return normalizeCart(payload);
  },

  checkout: async (cartId: number): Promise<any> => {
    const response = await api.post(`/carts/${cartId}/checkout`);
    const payload = response.data.data || response.data;
    return payload;
  },
};

function normalizeCart(raw: any): Cart {
  if (!raw) return raw;
  // ensure top-level id exists
  if (raw.id_carrito && !raw.id) {
    raw.id = raw.id_carrito;
  }
  // normalize items array if present
  if (Array.isArray(raw.items)) {
    raw.items = raw.items.map((it: any) => {
      // map id fields if present
      if (it.id_carrito_producto && !it.id) it.id = it.id_carrito_producto;
      if (it.id_producto && !it.producto_id) it.producto_id = it.id_producto;
      // normalize nested product id
      if (it.product && it.product.id_producto && !it.product.id) it.product.id = it.product.id_producto;
      return it;
    });
  }
  return raw;
}
