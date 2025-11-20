import { AdminLayout } from '../../components/admin/AdminLayout';

export const IngredientesAdmin = () => {
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-extrabold text-[#FFC72C]">Gestión de Ingredientes</h2>
          <button id="add-ingredient-btn" className="bg-[#FFC72C] text-black px-6 py-2 rounded-lg font-bold hover:bg-[#FFB700]">+ Nuevo Ingrediente</button>
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-lg border-2 border-[#FFC72C]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b-2 border-[#FFC72C]">
                <tr>
                  <th className="text-left py-2 text-[#FFC72C] font-bold">Nombre</th>
                  <th className="text-left py-2 text-[#FFC72C] font-bold">Cantidad</th>
                  <th className="text-left py-2 text-[#FFC72C] font-bold">Unidad</th>
                  <th className="text-left py-2 text-[#FFC72C] font-bold">Estado</th>
                  <th className="text-left py-2 text-[#FFC72C] font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700 hover:bg-[#222] transition">
                  <td className="py-3">Carne Premium</td>
                  <td className="py-3">45 kg</td>
                  <td className="py-3">Kilogramos</td>
                  <td className="py-3"><span className="px-3 py-1 rounded-full bg-green-900 text-green-200 text-sm font-bold">En Stock</span></td>
                  <td className="py-3">
                    <button className="bg-[#FFC72C] text-black px-3 py-1 rounded font-bold hover:bg-[#FFB700]">Editar</button>
                  </td>
                </tr>
                <tr className="border-b border-gray-700 hover:bg-[#222] transition">
                  <td className="py-3">Queso Americano</td>
                  <td className="py-3">12 porciones</td>
                  <td className="py-3">Paquetes</td>
                  <td className="py-3"><span className="px-3 py-1 rounded-full bg-yellow-900 text-yellow-200 text-sm font-bold">Bajo Stock</span></td>
                  <td className="py-3">
                    <button className="bg-[#FFC72C] text-black px-3 py-1 rounded font-bold hover:bg-[#FFB700]">Editar</button>
                  </td>
                </tr>
                <tr className="border-b border-gray-700 hover:bg-[#222] transition">
                  <td className="py-3">Lechuga</td>
                  <td className="py-3">5 kg</td>
                  <td className="py-3">Kilogramos</td>
                  <td className="py-3"><span className="px-3 py-1 rounded-full bg-red-900 text-red-200 text-sm font-bold">Agotado</span></td>
                  <td className="py-3">
                    <button className="bg-[#FFC72C] text-black px-3 py-1 rounded font-bold hover:bg-[#FFB700]">Editar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-[#1a1a1a] p-6 rounded-lg border-2 border-[#FFC72C]">
          <h3 className="text-2xl font-bold text-[#FFC72C] mb-4">Alertas de Inventario</h3>
          <div className="space-y-3">
            <div className="p-3 bg-red-900 rounded text-red-200">
              <strong>⚠️ Lechuga:</strong> Agotada - Reordenar urgentemente
            </div>
            <div className="p-3 bg-yellow-900 rounded text-yellow-200">
              <strong>⚠️ Queso Americano:</strong> Bajo stock - Solo 12 paquetes disponibles
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};