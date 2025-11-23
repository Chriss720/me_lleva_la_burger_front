import api from './api';
import type { Cart, CartItem } from '../types';

export const cartService = {
  getCart: async (cartId: number): Promise<Cart> => {
    const response = await api.get(`/carts/${cartId}`);
    const payload = response.data.data || response.data;
    return normalizeCart(payload);
  },

  getMyCart: async (): Promise<Cart> => {
    const userStr = localStorage.getItem('clienteActual');
    if (!userStr) throw new Error('No active session');
    const user = JSON.parse(userStr);
    const userId = user.id || user.id_cliente || user.sub; // Handle various user object shapes

    const response = await api.get(`/carts/customer/${userId}`);
    let payload = response.data.data || response.data;

    // If no cart found (empty array or null), create one
    if (!payload || (Array.isArray(payload) && payload.length === 0)) {
      console.log('🛒 No cart found, creating new one...');
      const createResponse = await api.post('/carts', {
        id_cliente: userId,
        estado: 'activo'
      });
      payload = createResponse.data.data || createResponse.data;
    }

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
    const response = await api.post(`/orders/from-cart/${cartId}`);
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

  // Map cartProducts to items if items is missing
  if (!raw.items && raw.cartProducts) {
    raw.items = raw.cartProducts;
  }

  // normalize items array if present
  if (Array.isArray(raw.items)) {
    raw.items = raw.items.map((it: any) => {
      // map id fields if present
      if (it.id_carrito_producto && !it.id) it.id = it.id_carrito_producto;
      if (it.id_producto && !it.producto_id) it.producto_id = it.id_producto;

      // normalize nested product
      if (it.product) {
        it.producto = it.product;
        if (it.product.id_producto && !it.product.id) it.product.id = it.product.id_producto;
      }

      // ensure precio_unitario exists
      if (!it.precio_unitario && it.producto && it.producto.precio) {
        it.precio_unitario = Number(it.producto.precio);
      }

      // calculate subtotal if missing
      if (!it.subtotal && it.cantidad && it.precio_unitario) {
        it.subtotal = it.cantidad * it.precio_unitario;
      }

      return it;
    });
  }
  return raw;
}
