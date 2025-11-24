import api from './api';
import type { Cart, CartItem } from '../types';

export const cartService = {
  getCart: async (cartId: number): Promise<Cart> => {
    const response = await api.get(`/carts/${cartId}`);
    const payload = response.data.data || response.data;
    return normalizeCart(payload);
  },

  getMyCart: async (customerId: number): Promise<Cart> => {
    try {
      const response = await api.get(`/carts/customer/${customerId}`);
      let payload = response.data.data || response.data;

      if (Array.isArray(payload)) {
        if (payload.length === 0) {
          // No cart found, create one
          return await cartService.createCart(customerId);
        }
        payload = payload[0];
      } else if (!payload) {
        return await cartService.createCart(customerId);
      }

      return normalizeCart(payload);
    } catch (error) {
      // If 404 or other error, try to create
      console.error("Error fetching cart, trying to create one", error);
      return await cartService.createCart(customerId);
    }
  },

  createCart: async (customerId: number): Promise<Cart> => {
    const response = await api.post('/carts', {
      id_cliente: customerId,
      estado: 'activo'
    });
    const payload = response.data.data || response.data;
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
    // The backend endpoint is /orders/from-cart/:cartId
    // It optionally takes employeeId query param. We use 1 as a default "system/admin" employee if needed, 
    // or let backend handle it.
    const response = await api.post(`/orders/from-cart/${cartId}?employeeId=1`);
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
