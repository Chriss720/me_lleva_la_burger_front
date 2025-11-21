import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../components/layout/Layout';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('⚠️ Por favor, completa todos los campos.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(email, password);
      console.log('Login user object:', user); // Debug

      // Check for admin/employee role with multiple property names and case insensitivity
      const role = (user?.tipo || user?.rol_cliente || user?.rol || user?.role || '').toString().toLowerCase();
      const isEmployee = ['empleado', 'admin', 'employee', 'administrador'].includes(role);

      if (isEmployee) {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('❌ Comprueba tu contraseña y nombre de cuenta e inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <main className="min-h-screen flex items-center justify-center bg-black text-white font-oswald p-8">
        <div className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-xl border-2 border-[#FFC72C] text-center">
          <h1 className="text-2xl text-[#FFC72C] font-extrabold mb-6 uppercase">INICIA SESIÓN</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-left mb-1 text-white">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 bg-[#333] border border-[#555] rounded-md text-white focus:outline-none focus:border-[#FFC72C]"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-left mb-1 text-white">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 bg-[#333] border border-[#555] rounded-md text-white focus:outline-none focus:border-[#FFC72C]"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-3 bg-[#DA291C] text-white font-extrabold rounded-full uppercase hover:bg-[#a81f13] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Cargando...' : 'Entrar'}
            </button>

            {error && <p className="text-red-400 text-sm">{error}</p>}
          </form>

          <div className="mt-4 text-sm text-gray-300">
            <p>
              <a href="#" className="text-[#FFC72C] hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </p>
            <p className="mt-2">
              ¿No tienes cuenta?{' '}
              <a href="/register" className="text-[#FFC72C] hover:underline">
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
};
