import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // Usamos el endpoint unificado de login
            // FIX: Backend espera 'email', no 'correo'
            const response = await client.post('/auth/login', {
                email: email,
                contrasena: password,
            });

            const { access_token, user } = response.data;

            // Mapeamos el usuario para el contexto
            // El backend devuelve user con id_empleado/id_cliente, necesitamos normalizarlo si es necesario
            // Asumimos que el backend devuelve { access_token, user: { ... } }

            // Ajuste: El backend puede devolver estructuras diferentes según si es empleado o cliente
            // Pero para este caso nos enfocamos en empleados/staff
            const userData = {
                id: user.id_empleado || user.id,
                email: user.correo_empleado || user.email,
                role: user.cargo || 'cliente', // 'gerente', 'encargado', 'empleado', 'cajero'
                nombre: user.nombre_empleado || user.nombre,
            };

            login(access_token, userData);

            // Redirección basada en el rol
            const role = (userData.role || '').toLowerCase();
            if (['gerente', 'encargado'].includes(role)) {
                navigate('/admin/empleados');
            } else if (['empleado', 'cajero'].includes(role)) {
                navigate('/staff/pedidos');
            } else {
                navigate('/'); // Fallback
            }
        } catch (err: any) {
            console.error(err);
            setError('Credenciales inválidas o error en el servidor');
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] p-8 rounded-lg border-2 border-[#FFC72C] w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-[#FFC72C] mb-2 font-oswald">BURGER EXPRESS</h1>
                    <p className="text-gray-400">Acceso a empleados</p>
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[#FFC72C] font-bold mb-2">Correo Electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#222] text-white border border-gray-700 rounded p-3 focus:border-[#FFC72C] focus:outline-none transition"
                            placeholder="ejemplo@burgerexpress.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-[#FFC72C] font-bold mb-2">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#222] text-white border border-gray-700 rounded p-3 focus:border-[#FFC72C] focus:outline-none transition"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#FFC72C] text-black font-bold py-3 rounded hover:bg-[#FFB700] transition transform active:scale-95"
                    >
                        INICIAR SESIÓN
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
