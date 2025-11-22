import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { LocationPage } from './pages/LocationPage';
import { ContactPage } from './pages/ContactPage';
import { Register } from './pages/Register';
import { Dashboard } from './pages/admin/Dashboard';
import { MenuAdmin } from './pages/admin/Menu';
import { PedidosAdmin } from './pages/admin/Pedidos';
import { IngredientesAdmin } from './pages/admin/Ingredientes';
import { EmpleadosAdmin } from './pages/admin/Empleados';
import { AddToCart } from './pages/AddToCart';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import './App.css';

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/carts/add/:productId" element={<AddToCart />} />
        <Route path="/ubicacion" element={<LocationPage />} />
        <Route path="/contacto" element={<ContactPage />} />

        {/* Admin routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/menu" element={<MenuAdmin />} />
          <Route path="/admin/pedidos" element={<PedidosAdmin />} />
          <Route path="/admin/ingredientes" element={<IngredientesAdmin />} />
          <Route path="/admin/empleados" element={<EmpleadosAdmin />} />
        </Route>

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
