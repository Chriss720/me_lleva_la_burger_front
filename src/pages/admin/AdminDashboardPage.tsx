import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboardPage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="p-8 bg-black min-h-full text-white">
            <h1 className="text-4xl font-extrabold text-[#FFC72C] mb-8 font-oswald uppercase">Dashboard</h1>

            <div className="bg-[#1a1a1a] p-8 rounded-lg border-l-4 border-[#FFC72C] shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Bienvenido, {user?.nombre || 'Administrador'}</h2>
                <p className="text-gray-400 text-lg">
                    Desde aquí puedes gestionar todos los aspectos de Burger Express.
                    Utiliza el menú lateral para navegar entre las diferentes secciones.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {/* Stats Cards (Placeholders) */}
                <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
                    <h3 className="text-gray-400 text-sm uppercase font-bold mb-2">Pedidos Hoy</h3>
                    <p className="text-3xl font-bold text-white">24</p>
                </div>
                <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
                    <h3 className="text-gray-400 text-sm uppercase font-bold mb-2">Ingresos</h3>
                    <p className="text-3xl font-bold text-[#FFC72C]">$4,250</p>
                </div>
                <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
                    <h3 className="text-gray-400 text-sm uppercase font-bold mb-2">Empleados Activos</h3>
                    <p className="text-3xl font-bold text-white">8</p>
                </div>
                <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
                    <h3 className="text-gray-400 text-sm uppercase font-bold mb-2">Productos</h3>
                    <p className="text-3xl font-bold text-white">15</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
