import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { Customer, AuthResponse } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<Customer | null>;
  register: (name: string, lastName: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Customer | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Cargar usuario al iniciar
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsInitializing(false);
  }, []);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      return authService.login({
        correo_cliente: email,
        contrasena_cliente: password,
      });
    },
    onSuccess: (response: AuthResponse) => {
      const user = (response.usuario || response.user || response.cliente) ?? null;
      console.log('AuthContext login response user:', user);
      setUser(user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { name: string; lastName: string; email: string; password: string; phone?: string }) => {
      return authService.register({
        nombre_cliente: data.name,
        apellido_cliente: data.lastName,
        correo_cliente: data.email,
        contrasena_cliente: data.password,
        telefono_cliente: data.phone || '',
        direccion: 'No especificada',
        estado_cliente: 'activo',
      });
    },
    onSuccess: (response: AuthResponse) => {
      setUser((response.usuario || response.user || response.cliente) ?? null);
    },
  });

  const login = async (email: string, password: string) => {
    const response = await loginMutation.mutateAsync({ email, password });
    return (response.usuario || response.user || response.cliente) ?? null;
  };

  const register = async (name: string, lastName: string, email: string, password: string, phone?: string) => {
    await registerMutation.mutateAsync({ name, lastName, email, password, phone });
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading: isInitializing || loginMutation.isPending || registerMutation.isPending,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
