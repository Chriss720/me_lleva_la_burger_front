import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!user || user.rol_cliente !== 'empleado') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
