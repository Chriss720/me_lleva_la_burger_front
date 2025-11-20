import api from './api';
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login/customer', {
      correo_cliente: credentials.correo_cliente || credentials.email,
      contrasena_cliente: credentials.contrasena_cliente || credentials.password,
    });
    
    const data = response.data.data || response.data;
    
    // Guardar token y usuario
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    }
    if (data.usuario || data.user || data.cliente) {
      localStorage.setItem('clienteActual', JSON.stringify(data.usuario || data.user || data.cliente));
    }
    
    return data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post('/customer', {
      nombre_cliente: credentials.nombre_cliente,
      apellido_cliente: credentials.apellido_cliente,
      correo_cliente: credentials.correo_cliente,
      contrasena_cliente: credentials.contrasena_cliente,
      telefono_cliente: credentials.telefono_cliente,
      direccion: credentials.direccion || 'No especificada',
      estado_cliente: credentials.estado_cliente || 'activo',
    });
    
    const data = response.data.data || response.data;
    
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    }
    if (data.usuario || data.user || data.cliente) {
      localStorage.setItem('clienteActual', JSON.stringify(data.usuario || data.user || data.cliente));
    }
    
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('clienteActual');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('clienteActual');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};
