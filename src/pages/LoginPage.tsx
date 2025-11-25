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

        // Try employee login first
        try {
            const employeeResponse = await client.post('/auth/login/employee', {
                correo_empleado: email,
                contrasena_empleado: password,
            });

            const { access_token, user } = employeeResponse.data;

            // Mapeamos el usuario para el contexto
            const userData = {
                id: user.id,
                email: user.email,
                role: user.cargo, // 'gerente', 'encargado', 'empleado', 'cajero'
                nombre: user.nombre,
            };

            login(access_token, userData);

            // Redirección basada en el rol
            const role = (userData.role || '').toLowerCase();
            if (['gerente', 'encargado'].includes(role)) {
                navigate('/admin/dashboard');
            } else if (['empleado', 'cajero'].includes(role)) {
                navigate('/staff/pedidos');
            } else {
                navigate('/'); // Fallback
            }
            return; // Exit after successful employee login
        } catch (employeeError: any) {
            // Employee login failed, try client login
            console.log('Employee login failed, trying client login...');

            try {
                const clientResponse = await client.post('/auth/login/customer', {
                    correo_cliente: email,
                    contrasena_cliente: password,
                });

                const { access_token, user } = clientResponse.data;

                // Mapear el usuario cliente para el contexto
                const clientData = {
                    id: user.id,
                    email: user.correo_cliente || email,
                    role: 'cliente', // Indicar que es un cliente
                    nombre_cliente: user.nombre_cliente,
                    apellido_cliente: user.apellido_cliente,
                    correo_cliente: user.correo_cliente,
                };

                // IMPORTANTE: Usar login() del contexto para que se actualice el estado
                // y se dispare el useEffect en Header que carga el carrito
                login(access_token, clientData);

                // También guardar en clienteActual para compatibilidad
                localStorage.setItem('clienteActual', JSON.stringify(user));

                // Redirigir al menú principal
                navigate('/');
            } catch (clientError: any) {
                // Both employee and client login failed
                console.error('Both login attempts failed:', { employeeError, clientError });
                setError('Credenciales inválidas');
            }
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] p-8 rounded-lg border-2 border-[#FFC72C] w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-[#FFC72C] mb-2 font-oswald">Inicia sesion</h1>
                    <p className="text-gray-400">Inicia sesión para continuar</p>
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
