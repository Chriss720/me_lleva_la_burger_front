// Tipos para la aplicación

export interface Product {
  id: number;
  nombre_producto: string;
  descripcion: string;
  ingredientes: string;
  precio: number;
  foto?: string;
  disponibilidad: string;
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
  id_producto?: number; // Backend compatibility
  producto?: Product;
  cantidad: number;
  precio_unitario: number;
  subtotal?: number;
}

export interface Cart {
  id: number;
  id_carrito?: number; // Backend compatibility
  cliente_id: number;
  id_cliente?: number; // Backend compatibility
  items?: CartItem[];
  cartProducts?: any[]; // Backend compatibility
  total?: number;
  estado?: string;
}

export interface Order {
  id: number;
  id_pedido?: number; // Backend compatibility
  cliente_id: number;
  id_cliente?: number; // Backend compatibility
  numero_orden?: string;
  total: number;
  estado: string;
  fecha_pedido?: string;
  items?: CartItem[];
  customer?: Customer; // For relations
  orderProducts?: any[]; // For relations
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
