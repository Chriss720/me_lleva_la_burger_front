import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Customer } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password:string) => Promise<Customer | null>;
  register: (name: string, lastName: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cargar usuario al iniciar
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login({
        correo_cliente: email,
        contrasena_cliente: password,
      });
      const user = (response.usuario || response.user || response.cliente) ?? null;
      console.log('AuthContext login response user:', user); // Debug
      setUser(user);
      return user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, lastName: string, email: string, password: string, phone?: string) => {
    setIsLoading(true);
    try {
      const response = await authService.register({
        nombre_cliente: name,
        apellido_cliente: lastName,
        correo_cliente: email,
        contrasena_cliente: password,
        telefono_cliente: phone || '',
        direccion: 'No especificada',
        estado_cliente: 'activo',
      });
      setUser((response.usuario || response.user || response.cliente) ?? null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
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
