// Tipos para la aplicación

export interface Product {
  id: number;
  nombre_producto: string;
  descripcion: string;
  precio: number;
  imagen?: string;
  categoria?: string;
  id_producto?: number;
}

export interface Customer {
  id: number;
  nombre_cliente: string;
  apellido_cliente: string;
  correo_cliente: string;
  telefono?: string;
  email?: string;
  rol_cliente?: string;
  nombre?: string;
  apellido?: string;
  tipo?: 'customer' | 'employee' | string;
  rol?: string;
  role?: string;
}

export interface CartItem {
  id: number;
  producto_id: number;
  producto?: Product;
  cantidad: number;
  precio_unitario: number;
  subtotal?: number;
}

export interface Cart {
  id: number;
  cliente_id: number;
  items?: CartItem[];
  total?: number;
  estado?: string;
}

export interface Order {
  id: number;
  cliente_id: number;
  numero_orden?: string;
  total: number;
  estado: string;
  fecha_pedido?: string;
  items?: CartItem[];
}

export interface AuthResponse {
  access_token?: string;
  token?: string;
  usuario?: Customer;
  user?: Customer;
  cliente?: Customer;
}

export interface LoginCredentials {
  correo_cliente?: string;
  contrasena_cliente?: string;
  email?: string;
  password?: string;
}

export interface RegisterCredentials {
  nombre_cliente: string;
  apellido_cliente: string;
  correo_cliente: string;
  contrasena_cliente: string;
  telefono_cliente: string;
  direccion?: string;
  estado_cliente?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
