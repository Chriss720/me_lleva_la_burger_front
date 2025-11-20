import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../components/layout/Layout';

export const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validación
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('⚠️ Por favor, completa todos los campos requeridos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('❌ Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setError('❌ La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    try {
      await register(firstName, lastName, email, password, phone);
      navigate('/');
    } catch (err) {
      console.error('Register error:', err);
      setError('❌ No se pudo completar el registro. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <main className="min-h-screen flex items-center justify-center bg-black text-white font-oswald p-8">
        <div className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-xl border-2 border-[#FFC72C]">
          <h1 className="text-2xl text-[#FFC72C] font-extrabold mb-6 uppercase text-center">CREAR CUENTA</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="firstName" className="block text-left mb-1 text-white">
                Nombre
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full p-3 bg-[#333] border border-[#555] rounded-md text-white focus:outline-none focus:border-[#FFC72C]"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-left mb-1 text-white">
                Apellido
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full p-3 bg-[#333] border border-[#555] rounded-md text-white focus:outline-none focus:border-[#FFC72C]"
              />
            </div>

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
              <label htmlFor="phone" className="block text-left mb-1 text-white">
                Teléfono (Opcional)
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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

            <div>
              <label htmlFor="confirmPassword" className="block text-left mb-1 text-white">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-3 bg-[#333] border border-[#555] rounded-md text-white focus:outline-none focus:border-[#FFC72C]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-3 bg-[#DA291C] text-white font-extrabold rounded-full uppercase hover:bg-[#a81f13] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Registrando...' : 'Crear Cuenta'}
            </button>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          </form>

          <div className="mt-4 text-sm text-gray-300 text-center">
            <p>
              ¿Ya tienes cuenta?{' '}
              <a href="/login" className="text-[#FFC72C] hover:underline">
                Inicia sesión aquí
              </a>
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
};
