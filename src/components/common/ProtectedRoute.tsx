import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const role = (user?.tipo || user?.rol_cliente || user?.rol || user?.role || '').toString().toLowerCase();
  const isEmployee = user && ['empleado', 'admin', 'employee', 'administrador'].includes(role);

  if (!user || !isEmployee) {
    console.log('Access denied. User:', user, 'isEmployee:', isEmployee);
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
