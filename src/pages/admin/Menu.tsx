import { AdminLayout } from '../../components/admin/AdminLayout';
import { productService } from '../../services/productService';
import { useEffect, useState } from 'react';
import type { Product } from '../../types';
import { ProductForm } from '../../components/admin/ProductForm';

export const MenuAdmin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);

  const load = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error loading products', err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (p: Product) => {
    setEditing(p);
    setShowForm(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm('¿Eliminar producto? Esta acción no se puede deshacer.')) return;
    try {
      await productService.deleteProduct(id);
      await load();
    } catch (err) {
      console.error('Error deleting product', err);
      alert('Error al eliminar');
    }
  };

  const handleSave = async (data: Partial<Product>) => {
    try {
      if (editing && editing.id) {
        await productService.updateProduct(editing.id, data);
      } else {
        await productService.createProduct(data);
      }
      setShowForm(false);
      await load();
    } catch (err) {
      console.error('Error saving product', err);
      throw err;
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-extrabold text-[#FFC72C]">Gestión de Menú</h2>
          <button onClick={handleCreate} className="bg-[#FFC72C] text-black px-6 py-2 rounded-lg font-bold hover:bg-[#FFB700]">+ Nuevo Producto</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="bg-[#1a1a1a] rounded-lg overflow-hidden border-2 border-[#FFC72C]">
                <img src={product.imagen} alt={product.nombre_producto} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-[#FFC72C] mb-2">{product.nombre_producto}</h3>
                  <p className="text-sm text-gray-300 mb-3">{product.descripcion}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-extrabold text-white">${product.precio.toFixed(2)}</span>
                    <div className="space-x-2">
                      <button onClick={() => handleEdit(product)} className="bg-[#FFC72C] text-black px-3 py-1 rounded font-bold hover:bg-[#FFB700]">Editar</button>
                      <button onClick={() => handleDelete(product.id)} className="bg-[#DA291C] text-white px-3 py-1 rounded font-bold hover:bg-[#a81f13]">Eliminar</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-16">
              <p className="text-gray-400 text-lg">No hay productos en el menú</p>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <ProductForm initial={editing || {}} onCancel={() => setShowForm(false)} onSave={handleSave} />
      )}
    </AdminLayout>
  );
};
