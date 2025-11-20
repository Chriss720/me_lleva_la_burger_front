# Me Lleva la Burger - Frontend

Frontend React + TypeScript para la aplicación "Me Lleva la Burger"

## 🚀 Requisitos Previos

- Node.js 16+ instalado
- npm o yarn
- Backend corriendo en `http://localhost:3000`

## 📦 Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**

Copiar `.env.example` a `.env`:
```bash
cp .env.example .env
```

El archivo `.env` debe tener:
```
VITE_API_URL=http://localhost:3000/api
```

## 🏃 Desarrollo

Correr el servidor de desarrollo:
```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:5173` (o el puerto que indique Vite)

## 🔨 Build

Generar build para producción:
```bash
npm run build
```

Los archivos compilados se generarán en la carpeta `dist/`

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── common/         # Componentes comunes (ProductCard, etc)
│   └── layout/         # Componentes de layout (Header, Footer, Layout)
├── context/            # Context de React (AuthContext)
├── hooks/              # Custom hooks (useAuth, useCart, useProducts)
├── pages/              # Páginas (Home, Login, Register)
├── services/           # Servicios API (api, authService, etc)
├── types/              # Interfaces TypeScript
├── App.tsx             # Componente principal
├── main.tsx            # Punto de entrada
└── index.css           # Estilos globales
```

## 🔌 API Endpoints

El frontend se conecta a los siguientes endpoints del backend:

### Autenticación
- `POST /auth/login` - Login
- `POST /customer` - Registro

### Productos
- `GET /all-products` - Obtener todos los productos
- `GET /product/:id` - Obtener producto por ID

### Carrito
- `GET /carts/:id` - Obtener carrito
- `GET /carts/me` - Obtener mi carrito
- `POST /carts/:id/add/:productId` - Agregar al carrito
- `POST /carts/:id/remove/:productId` - Remover del carrito
- `POST /carts/:id/checkout` - Procesar pago

### Pedidos
- `GET /orders/customer/:customerId` - Obtener pedidos del cliente
- `GET /orders/:id` - Obtener pedido por ID

## 🎨 Colores del Tema

- **Amarillo**: `#FFC72C`
- **Rojo**: `#DA291C`
- **Negro**: `#000000`
- **Gris Oscuro**: `#1a1a1a`

## 🔐 Autenticación

La autenticación se maneja mediante:
- Token JWT almacenado en `localStorage`
- User actual almacenado en `localStorage` como `clienteActual`
- Context de React (`AuthContext`) para estado global

## 📝 Notas Importantes

- El token se envía automáticamente en el header `Authorization: Bearer <token>`
- Al desloguear, se elimina el token y el usuario del localStorage
- Las rutas protegidas redirigen a login si no está autenticado

## 🐛 Troubleshooting

### Error de CORS
Asegúrate que el backend tiene CORS habilitado y está corriendo en `http://localhost:3000`

### Token expirado
El error 401 redirige automáticamente a la página de login

### Problemas con Tailwind
Las clases de Tailwind están configuradas en `vite.config.ts`. Ejecuta:
```bash
npm install
npm run dev
```

## 📞 Soporte

Para problemas, verifica:
1. El backend esté corriendo
2. Las variables de entorno estén configuradas
3. Las dependencias estén instaladas (`npm install`)

---

**Versión:** 0.0.0  
**Última actualización:** Nov 2025
