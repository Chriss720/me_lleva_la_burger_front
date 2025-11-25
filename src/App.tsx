import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Home } from './pages/Home';
import LoginPage from './pages/LoginPage';
import { LocationPage } from './pages/LocationPage';
import { ContactPage } from './pages/ContactPage';
import RegisterPage from './pages/RegisterPage';
import { Dashboard } from './pages/admin/Dashboard';
import MenuAdmin from './pages/admin/AdminMenuPage';
import { PedidosAdmin } from './pages/admin/Pedidos';
import { IngredientesAdmin } from './pages/admin/Ingredientes';
import { EmpleadosAdmin } from './pages/admin/Empleados';
import { AddToCart } from './pages/AddToCart';
import CheckoutPage from './pages/CheckoutPage';
import StaffOrdersPage from './pages/staff/StaffOrdersPage';
import './App.css';

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/carts/add/:productId" element={<AddToCart />} />
        <Route path="/ubicacion" element={<LocationPage />} />
        <Route path="/ubicacion" element={<LocationPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Staff routes */}
        <Route path="/staff/pedidos" element={<StaffOrdersPage />} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/menu" element={<MenuAdmin />} />
        <Route path="/admin/pedidos" element={<PedidosAdmin />} />
        <Route path="/admin/ingredientes" element={<IngredientesAdmin />} />
        <Route path="/admin/empleados" element={<EmpleadosAdmin />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
