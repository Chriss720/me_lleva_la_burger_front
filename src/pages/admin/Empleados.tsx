import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '../../components/admin/AdminLayout';
import client from '../../api/client';

interface Employee {
  id_empleado: number;
  nombre_empleado: string;
  apellido_empleado: string;
  correo_empleado: string;
  cargo: string;
  telefono_empleado: string;
  estado_empleado: string;
}

export const EmpleadosAdmin = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    nombre_empleado: '',
    apellido_empleado: '',
    correo_empleado: '',
    cargo: '',
    telefono_empleado: '',
    contrasena_empleado: '',
    estado_empleado: 'activo'
  });

  // Fetch employees
  const { data: employees = [], isLoading } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      const res = await client.get('/employee');
      return res.data;
    }
  });

  // Create employee mutation
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      await client.post('/employee', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setShowModal(false);
      resetForm();
    }
  });

  // Update employee mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      // Remove password if empty to avoid validation errors or overwriting with empty string
      const dataToSend = { ...data };
      if (!dataToSend.contrasena_empleado) {
        delete dataToSend.contrasena_empleado;
      }
      await client.patch(`/employee/${id}`, dataToSend);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setShowModal(false);
      setEditingEmployee(null);
      resetForm();
    }
  });

  // Delete employee mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await client.delete(`/employee/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  });

  const resetForm = () => {
    setFormData({
      nombre_empleado: '',
      apellido_empleado: '',
      correo_empleado: '',
      cargo: '',
      telefono_empleado: '',
      contrasena_empleado: '',
      estado_empleado: 'activo'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployee) {
      updateMutation.mutate({ id: editingEmployee.id_empleado, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      nombre_empleado: employee.nombre_empleado,
      apellido_empleado: employee.apellido_empleado || '',
      correo_empleado: employee.correo_empleado,
      cargo: employee.cargo,
      telefono_empleado: employee.telefono_empleado,
      contrasena_empleado: '',
      estado_empleado: employee.estado_empleado
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este empleado?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleNewEmployee = () => {
    setEditingEmployee(null);
    resetForm();
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-extrabold text-[#FFC72C]">Empleados</h2>
          <button
            onClick={handleNewEmployee}
            className="bg-[#FFC72C] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#FFB700] transition"
          >
            + Nuevo Empleado
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFC72C] mx-auto"></div>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] rounded-lg border-2 border-[#FFC72C] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#222] border-b-2 border-[#FFC72C]">
                <tr>
                  <th className="p-4 text-left text-[#FFC72C] font-bold">ID</th>
                  <th className="p-4 text-left text-[#FFC72C] font-bold">Nombre</th>
                  <th className="p-4 text-left text-[#FFC72C] font-bold">Apellido</th>
                  <th className="p-4 text-left text-[#FFC72C] font-bold">Email</th>
                  <th className="p-4 text-left text-[#FFC72C] font-bold">Cargo</th>
                  <th className="p-4 text-left text-[#FFC72C] font-bold">Teléfono</th>
                  <th className="p-4 text-left text-[#FFC72C] font-bold">Estado</th>
                  <th className="p-4 text-left text-[#FFC72C] font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {employees.map((employee) => (
                  <tr key={employee.id_empleado} className="hover:bg-[#252525] transition">
                    <td className="p-4 text-white">#{employee.id_empleado}</td>
                    <td className="p-4 text-white">{employee.nombre_empleado}</td>
                    <td className="p-4 text-white">{employee.apellido_empleado}</td>
                    <td className="p-4 text-gray-400">{employee.correo_empleado}</td>
                    <td className="p-4 text-white">{employee.cargo}</td>
                    <td className="p-4 text-gray-400">{employee.telefono_empleado}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${employee.estado_empleado === 'activo'
                        ? 'bg-green-900 text-green-300'
                        : 'bg-red-900 text-red-300'
                        }`}>
                        {employee.estado_empleado}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(employee)}
                          className="bg-[#FFC72C] text-black px-4 py-2 rounded font-bold hover:bg-[#FFB700] transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(employee.id_empleado)}
                          className="bg-[#DA291C] text-white px-4 py-2 rounded font-bold hover:bg-[#a81f13] transition"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-[#1a1a1a] border-2 border-[#FFC72C] rounded-lg p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-[#FFC72C] mb-6">
                {editingEmployee ? 'Editar Empleado' : 'Nuevo Empleado'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#FFC72C] font-bold mb-2">Nombre</label>
                    <input
                      type="text"
                      value={formData.nombre_empleado}
                      onChange={(e) => setFormData({ ...formData, nombre_empleado: e.target.value })}
                      className="w-full bg-[#222] text-white border border-gray-700 rounded p-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#FFC72C] font-bold mb-2">Apellido</label>
                    <input
                      type="text"
                      value={formData.apellido_empleado}
                      onChange={(e) => setFormData({ ...formData, apellido_empleado: e.target.value })}
                      className="w-full bg-[#222] text-white border border-gray-700 rounded p-3"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[#FFC72C] font-bold mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.correo_empleado}
                    onChange={(e) => setFormData({ ...formData, correo_empleado: e.target.value })}
                    className="w-full bg-[#222] text-white border border-gray-700 rounded p-3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#FFC72C] font-bold mb-2">Cargo</label>
                  <select
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    className="w-full bg-[#222] text-white border border-gray-700 rounded p-3"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Cajero">Cajero</option>
                    <option value="Patrona">Patrona</option>
                    <option value="Gerente">Gerente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#FFC72C] font-bold mb-2">Teléfono</label>
                  <input
                    type="text"
                    value={formData.telefono_empleado}
                    onChange={(e) => setFormData({ ...formData, telefono_empleado: e.target.value })}
                    className="w-full bg-[#222] text-white border border-gray-700 rounded p-3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#FFC72C] font-bold mb-2">
                    {editingEmployee ? 'Contraseña (dejar en blanco para no cambiar)' : 'Contraseña'}
                  </label>
                  <input
                    type="password"
                    value={formData.contrasena_empleado}
                    onChange={(e) => setFormData({ ...formData, contrasena_empleado: e.target.value })}
                    className="w-full bg-[#222] text-white border border-gray-700 rounded p-3"
                    required={!editingEmployee}
                  />
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-[#FFC72C] text-black py-3 rounded font-bold hover:bg-[#FFB700] transition"
                  >
                    {editingEmployee ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingEmployee(null);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-700 text-white py-3 rounded font-bold hover:bg-gray-600 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};