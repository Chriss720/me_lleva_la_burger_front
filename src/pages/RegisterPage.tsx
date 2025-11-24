import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import Swal from 'sweetalert2';

const RegisterPage: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await client.post('/customer', {
                nombre_cliente: nombre,
                apellido_cliente: apellido,
                correo_cliente: email,
                contrasena_cliente: password,
                telefono_cliente: telefono,
                direccion: direccion,
                estado_cliente: 'activo'
            });

            Swal.fire({
                title: '¡Registro Exitoso!',
                text: 'Ahora puedes iniciar sesión con tu cuenta.',
                icon: 'success',
                confirmButtonColor: '#FFC72C',
                background: '#000',
                color: '#fff'
            }).then(() => {
                navigate('/login');
            });

        } catch (err: any) {
            console.error('Registration failed', err);
            setError('Error al registrar. Intenta con otro correo.');
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2565&auto=format&fit=crop"
                    alt="Burger Background"
                    className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
            </div>

            <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-[#333] relative z-10 backdrop-blur-sm bg-opacity-90">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-[#FFC72C] mb-2 font-oswald tracking-wider">ÚNETE AL EQUIPO</h1>
                    <p className="text-gray-400 text-sm">Crea tu cuenta para ordenar las mejores burgers</p>
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-800 text-red-200 px-4 py-3 rounded mb-6 text-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-gray-300 text-sm font-bold mb-2 uppercase tracking-wide">Nombre</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full bg-[#2a2a2a] text-white border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:border-[#FFC72C] focus:ring-1 focus:ring-[#FFC72C] transition-all placeholder-gray-600"
                            placeholder="Ej. Juan"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-bold mb-2 uppercase tracking-wide">Apellido</label>
                        <input
                            type="text"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            className="w-full bg-[#2a2a2a] text-white border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:border-[#FFC72C] focus:ring-1 focus:ring-[#FFC72C] transition-all placeholder-gray-600"
                            placeholder="Ej. Pérez"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-bold mb-2 uppercase tracking-wide">Correo Electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#2a2a2a] text-white border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:border-[#FFC72C] focus:ring-1 focus:ring-[#FFC72C] transition-all placeholder-gray-600"
                            placeholder="tucorreo@ejemplo.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-bold mb-2 uppercase tracking-wide">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#2a2a2a] text-white border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:border-[#FFC72C] focus:ring-1 focus:ring-[#FFC72C] transition-all placeholder-gray-600"
                            placeholder="••••••••"
                            minLength={6}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-bold mb-2 uppercase tracking-wide">Teléfono</label>
                        <input
                            type="tel"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            className="w-full bg-[#2a2a2a] text-white border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:border-[#FFC72C] focus:ring-1 focus:ring-[#FFC72C] transition-all placeholder-gray-600"
                            placeholder="Ej. +52 1 33 2287 2144"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-bold mb-2 uppercase tracking-wide">Dirección</label>
                        <input
                            type="text"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            className="w-full bg-[#2a2a2a] text-white border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:border-[#FFC72C] focus:ring-1 focus:ring-[#FFC72C] transition-all placeholder-gray-600"
                            placeholder="Calle Principal 123"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#DA291C] hover:bg-[#b91c1c] text-white font-bold py-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-red-900/30 uppercase tracking-widest text-sm"
                    >
                        Registrarse
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-gray-800 pt-6">
                    <p className="text-gray-400 text-sm">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" className="text-[#FFC72C] hover:text-yellow-400 font-bold hover:underline transition-colors">
                            Inicia Sesión aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
