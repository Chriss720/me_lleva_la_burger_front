import React from 'react';

const AdminIngredientsPage: React.FC = () => {
    // Static data to match screenshot
    const ingredients = [
        { id: 1, nombre: 'Carne Premium', cantidad: '45 kg', unidad: 'Kilogramos', estado: 'En Stock', alerta: false },
        { id: 2, nombre: 'Queso Americano', cantidad: '12 porciones', unidad: 'Paquetes', estado: 'Bajo Stock', alerta: true, mensaje: 'Bajo stock - Solo 12 paquetes disponibles' },
        { id: 3, nombre: 'Lechuga', cantidad: '5 kg', unidad: 'Kilogramos', estado: 'Agotado', alerta: true, mensaje: 'Agotada - Reordenar urgentemente' },
    ];

    return (
        <div className="p-8 bg-black min-h-full text-white">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-[#FFC72C] font-oswald uppercase">Gestión de Ingredientes</h1>
                <button className="bg-[#FFC72C] text-black px-4 py-2 rounded font-bold hover:bg-[#FFB700]">
                    + Nuevo Ingrediente
                </button>
            </div>

            <div className="bg-[#1a1a1a] rounded-lg border border-[#333] overflow-hidden mb-8">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#FFC72C]">
                            <th className="p-4 text-[#FFC72C] font-bold uppercase">Nombre</th>
                            <th className="p-4 text-[#FFC72C] font-bold uppercase">Cantidad</th>
                            <th className="p-4 text-[#FFC72C] font-bold uppercase">Unidad</th>
                            <th className="p-4 text-[#FFC72C] font-bold uppercase">Estado</th>
                            <th className="p-4 text-[#FFC72C] font-bold uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ingredients.map((ing) => (
                            <tr key={ing.id} className="border-b border-gray-800 hover:bg-[#222]">
                                <td className="p-4 font-bold">{ing.nombre}</td>
                                <td className="p-4">{ing.cantidad}</td>
                                <td className="p-4">{ing.unidad}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${ing.estado === 'En Stock' ? 'bg-green-900 text-green-300' :
                                            ing.estado === 'Bajo Stock' ? 'bg-yellow-900 text-yellow-300' :
                                                'bg-red-900 text-red-300'
                                        }`}>
                                        {ing.estado}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button className="bg-[#FFC72C] text-black px-3 py-1 rounded font-bold hover:bg-[#FFB700] text-sm">
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Alertas */}
            <div className="bg-[#1a1a1a] rounded-lg border border-[#FFC72C] p-6">
                <h2 className="text-2xl font-bold text-[#FFC72C] mb-4">Alertas de Inventario</h2>
                <div className="space-y-3">
                    {ingredients.filter(i => i.alerta).map(ing => (
                        <div key={ing.id} className={`p-3 rounded font-bold flex items-center gap-2 ${ing.estado === 'Agotado' ? 'bg-red-900/50 text-red-200 border border-red-900' : 'bg-yellow-900/50 text-yellow-200 border border-yellow-900'
                            }`}>
                            <span className="text-xl">⚠</span>
                            {ing.mensaje}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminIngredientsPage;
