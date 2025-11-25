import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import type { Product } from '../../types';
import Swal from 'sweetalert2';
import { AdminLayout } from '../../components/admin/AdminLayout';

const AdminMenuPage: React.FC = () => {
    const { products, isLoading, createProduct, updateProduct, deleteProduct } = useProducts();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Form state
    const [formData, setFormData] = useState<Partial<Product>>({
        nombre_producto: '',
        descripcion: '',
        ingredientes: '',
        precio: 0,
        foto: '',
        disponibilidad: 'Disponible',
    });

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                nombre_producto: product.nombre_producto,
                descripcion: product.descripcion,
                ingredientes: product.ingredientes,
                precio: Number(product.precio),
                foto: product.foto,
                disponibilidad: product.disponibilidad,
            });
        } else {
            setEditingProduct(null);
            setFormData({
                nombre_producto: '',
                descripcion: '',
                ingredientes: '',
                precio: 0,
                foto: '',
                disponibilidad: 'Disponible',
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await updateProduct({ id: editingProduct.id || editingProduct.id_producto!, data: formData });
                Swal.fire('Actualizado', 'Producto actualizado correctamente', 'success');
            } else {
                await createProduct(formData);
                Swal.fire('Creado', 'Producto creado correctamente', 'success');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo guardar el producto', 'error');
        }
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await deleteProduct(id);
                Swal.fire('Eliminado', 'El producto ha sido eliminado', 'success');
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
            }
        }
    };

    return (
        <AdminLayout>
            <div className="p-8 bg-black min-h-full text-white">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-extrabold text-[#FFC72C] font-oswald uppercase">Gestión de Menú</h1>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-[#FFC72C] text-black px-4 py-2 rounded font-bold hover:bg-[#FFB700]"
                    >
                        + Nuevo Producto
                    </button>
                </div>

                <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-6">
                    {isLoading ? (
                        <div className="text-center py-10">Cargando productos...</div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 text-xl">No hay productos en el menú</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div key={product.id || product.id_producto} className="bg-[#222] rounded-lg overflow-hidden border border-[#333]">
                                    <div className="h-48 bg-gray-800 relative">
                                        {product.foto ? (
                                            <img src={product.foto} alt={product.nombre_producto} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-500">Sin imagen</div>
                                        )}
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <button
                                                onClick={() => handleOpenModal(product)}
                                                className="bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700"
                                            >
                                                ✎
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id || product.id_producto!)}
                                                className="bg-red-600 p-2 rounded-full text-white hover:bg-red-700"
                                            >
                                                🗑
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-xl font-bold text-[#FFC72C] mb-2">{product.nombre_producto}</h3>
                                        <p className="text-gray-400 text-sm mb-2 line-clamp-2">{product.descripcion}</p>
                                        <p className="text-gray-500 text-xs mb-4 line-clamp-1">Ingr: {product.ingredientes}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white font-bold text-lg">${product.precio}</span>
                                            <span className={`text-xs px-2 py-1 rounded ${product.disponibilidad === 'Disponible' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                                {product.disponibilidad}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-[#1a1a1a] rounded-lg w-full max-w-2xl border border-[#333] max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-[#333] flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-[#FFC72C]">
                                    {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white text-2xl">
                                    &times;
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-gray-300 mb-1">Nombre del Producto</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.nombre_producto}
                                        onChange={(e) => setFormData({ ...formData, nombre_producto: e.target.value })}
                                        className="w-full bg-[#111] border border-[#333] rounded p-2 text-white focus:border-[#FFC72C] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-1">Descripción</label>
                                    <textarea
                                        required
                                        value={formData.descripcion}
                                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                        className="w-full bg-[#111] border border-[#333] rounded p-2 text-white focus:border-[#FFC72C] outline-none h-20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-1">Ingredientes</label>
                                    <textarea
                                        required
                                        value={formData.ingredientes}
                                        onChange={(e) => setFormData({ ...formData, ingredientes: e.target.value })}
                                        className="w-full bg-[#111] border border-[#333] rounded p-2 text-white focus:border-[#FFC72C] outline-none h-20"
                                        placeholder="Lista de ingredientes..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 mb-1">Precio</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            step="0.01"
                                            value={formData.precio}
                                            onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
                                            className="w-full bg-[#111] border border-[#333] rounded p-2 text-white focus:border-[#FFC72C] outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-1">Disponibilidad</label>
                                        <select
                                            value={formData.disponibilidad}
                                            onChange={(e) => setFormData({ ...formData, disponibilidad: e.target.value })}
                                            className="w-full bg-[#111] border border-[#333] rounded p-2 text-white focus:border-[#FFC72C] outline-none"
                                        >
                                            <option value="Disponible">Disponible</option>
                                            <option value="Agotado">Agotado</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-1">URL de Imagen</label>
                                    <input
                                        type="text"
                                        value={formData.foto}
                                        onChange={(e) => setFormData({ ...formData, foto: e.target.value })}
                                        className="w-full bg-[#111] border border-[#333] rounded p-2 text-white focus:border-[#FFC72C] outline-none"
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                    />
                                </div>
                                <div className="pt-4 flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded bg-[#FFC72C] text-black font-bold hover:bg-[#FFB700]"
                                    >
                                        {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
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

export default AdminMenuPage;
