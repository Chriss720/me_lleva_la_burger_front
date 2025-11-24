import React, { useEffect, useState } from 'react';
import client from '../../api/client';
// import { useAuth } from '../../context/AuthContext';

interface Employee {
    id_empleado: number;
    nombre_empleado: string;
    apellido_empleado: string;
    correo_empleado: string;
    telefono_empleado: string;
    cargo: string;
    estado_empleado: string;
    contrasena_empleado?: string; // Solo para envío
}

const EmployeesPage: React.FC = () => {
    // const { user, logout } = useAuth(); // Handled by Layout now
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
    const [formData, setFormData] = useState<Partial<Employee>>({});
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await client.get('/employee');
            setEmployees(res.data);
        } catch (err) {
            console.error('Error fetching employees', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (employee?: Employee) => {
        if (employee) {
            setCurrentEmployee(employee);
            setFormData(employee);
        } else {
            setCurrentEmployee(null);
            setFormData({ estado_empleado: 'activo' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentEmployee(null);
        setFormData({});
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (currentEmployee) {
                // Edit
                await client.patch(`/employee/${currentEmployee.id_empleado}`, formData);
            } else {
                // Create
                await client.post('/employee', formData);
            }
            handleCloseModal();
            fetchEmployees();
        } catch (err) {
            console.error('Error saving employee', err);
            alert('Error al guardar empleado');
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await client.delete(`/employee/${deleteId}`);
            setIsDeleteModalOpen(false);
            setDeleteId(null);
            fetchEmployees();
        } catch (err) {
            console.error('Error deleting employee', err);
            alert('No se pudo eliminar el empleado');
        }
    };

    return (
        <div className="p-8 bg-black min-h-full text-white">

            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-4xl font-extrabold text-[#FFC72C] font-oswald">Empleados</h2>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-[#FFC72C] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#FFB700] transition"
                    >
                        + Nuevo Empleado
                    </button>
                </div>

                <div className="bg-[#1a1a1a] p-6 rounded-lg border-2 border-[#FFC72C] overflow-x-auto">
                    {loading ? (
                        <p className="text-center text-gray-400">Cargando empleados...</p>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="border-b-2 border-[#FFC72C]">
                                <tr>
                                    <th className="py-2 text-[#FFC72C] font-bold">ID</th>
                                    <th className="py-2 text-[#FFC72C] font-bold">Nombre</th>
                                    <th className="py-2 text-[#FFC72C] font-bold">Email</th>
                                    <th className="py-2 text-[#FFC72C] font-bold">Cargo</th>
                                    <th className="py-2 text-[#FFC72C] font-bold">Teléfono</th>
                                    <th className="py-2 text-[#FFC72C] font-bold">Estado</th>
                                    <th className="py-2 text-[#FFC72C] font-bold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.length > 0 ? (
                                    employees.map((emp) => (
                                        <tr key={emp.id_empleado} className="border-b border-gray-700 hover:bg-[#222] transition">
                                            <td className="py-3 text-gray-300">#{emp.id_empleado}</td>
                                            <td className="py-3">{emp.nombre_empleado} {emp.apellido_empleado}</td>
                                            <td className="py-3 text-gray-400">{emp.correo_empleado}</td>
                                            <td className="py-3"><span className="bg-gray-800 px-2 py-1 rounded text-sm">{emp.cargo}</span></td>
                                            <td className="py-3 text-gray-400">{emp.telefono_empleado}</td>
                                            <td className="py-3">
                                                <span className={`px-2 py-1 rounded text-sm font-bold ${emp.estado_empleado === 'activo' ? 'text-green-400' : 'text-red-400'}`}>
                                                    {emp.estado_empleado}
                                                </span>
                                            </td>
                                            <td className="py-3 flex gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(emp)}
                                                    className="bg-[#FFC72C] text-black px-3 py-1 rounded font-bold text-sm hover:bg-[#FFB700]"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(emp.id_empleado)}
                                                    className="bg-[#DA291C] text-white px-3 py-1 rounded font-bold text-sm hover:bg-red-700"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8 text-gray-400">No hay empleados registrados</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal Formulario */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a1a] p-6 rounded-lg border-2 border-[#FFC72C] w-full max-w-lg">
                        <h3 className="text-2xl text-[#FFC72C] font-bold mb-4 font-oswald">
                            {currentEmployee ? 'Editar Empleado' : 'Nuevo Empleado'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-3 max-h-[80vh] overflow-y-auto pr-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Nombre</label>
                                    <input name="nombre_empleado" value={formData.nombre_empleado || ''} onChange={handleChange} className="w-full p-2 bg-[#222] text-white rounded border border-gray-700 focus:border-[#FFC72C] outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Apellido</label>
                                    <input name="apellido_empleado" value={formData.apellido_empleado || ''} onChange={handleChange} className="w-full p-2 bg-[#222] text-white rounded border border-gray-700 focus:border-[#FFC72C] outline-none" required />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Correo</label>
                                <input type="email" name="correo_empleado" value={formData.correo_empleado || ''} onChange={handleChange} className="w-full p-2 bg-[#222] text-white rounded border border-gray-700 focus:border-[#FFC72C] outline-none" required />
                            </div>

                            {!currentEmployee && (
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Contraseña</label>
                                    <input type="password" name="contrasena_empleado" value={formData.contrasena_empleado || ''} onChange={handleChange} className="w-full p-2 bg-[#222] text-white rounded border border-gray-700 focus:border-[#FFC72C] outline-none" required />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Teléfono</label>
                                <input name="telefono_empleado" value={formData.telefono_empleado || ''} onChange={handleChange} className="w-full p-2 bg-[#222] text-white rounded border border-gray-700 focus:border-[#FFC72C] outline-none" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Cargo</label>
                                    <select name="cargo" value={formData.cargo || ''} onChange={handleChange} className="w-full p-2 bg-[#222] text-white rounded border border-gray-700 focus:border-[#FFC72C] outline-none" required>
                                        <option value="">Seleccionar...</option>
                                        <option value="gerente">Gerente</option>
                                        <option value="encargado">Encargado</option>
                                        <option value="cajero">Cajero</option>
                                        <option value="empleado">Empleado</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Estado</label>
                                    <select name="estado_empleado" value={formData.estado_empleado || 'activo'} onChange={handleChange} className="w-full p-2 bg-[#222] text-white rounded border border-gray-700 focus:border-[#FFC72C] outline-none">
                                        <option value="activo">Activo</option>
                                        <option value="inactivo">Inactivo</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 mt-6">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-[#FFC72C] text-black rounded font-bold hover:bg-[#FFB700]">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Eliminar */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a1a] p-6 rounded-lg border-2 border-[#DA291C] w-full max-w-md text-center">
                        <h3 className="text-2xl font-bold text-[#FFC72C] mb-4 font-oswald">Confirmar eliminación</h3>
                        <p className="text-gray-300 mb-6">¿Estás seguro de que quieres eliminar este empleado? Esta acción no se puede deshacer.</p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">Cancelar</button>
                            <button onClick={confirmDelete} className="px-4 py-2 bg-[#DA291C] text-white rounded font-bold hover:bg-red-700">Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeesPage;
