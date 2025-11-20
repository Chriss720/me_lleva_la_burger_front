import React, { useState, useEffect } from 'react';
import type { Product } from '../../types';

interface Props {
  initial?: Partial<Product>;
  onCancel: () => void;
  onSave: (data: Partial<Product>) => Promise<void>;
}

export const ProductForm: React.FC<Props> = ({ initial = {}, onCancel, onSave }) => {
  const [nombre, setNombre] = useState(initial.nombre_producto || '');
  const [descripcion, setDescripcion] = useState(initial.descripcion || '');
  const [precio, setPrecio] = useState<number>(initial.precio ?? 0);
  const [imagen, setImagen] = useState(initial.imagen || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNombre(initial.nombre_producto || '');
    setDescripcion(initial.descripcion || '');
    setPrecio(initial.precio ?? 0);
    setImagen(initial.imagen || '');
  }, [initial]);

  const validate = () => {
    if (!nombre.trim()) return 'El nombre es requerido';
    if (!descripcion.trim()) return 'La descripción es requerida';
    if (isNaN(precio) || precio <= 0) return 'El precio debe ser mayor que 0';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setSaving(true);
    try {
      await onSave({
        nombre_producto: nombre,
        descripcion,
        precio,
        imagen,
      });
    } catch (err) {
      console.error(err);
      setError('Error al guardar el producto');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <form onSubmit={handleSubmit} className="bg-[#1a1a1a] w-full max-w-2xl p-6 rounded-lg border-2 border-[#FFC72C]">
        <h3 className="text-2xl text-[#FFC72C] font-bold mb-4">{initial?.id ? 'Editar Producto' : 'Nuevo Producto'}</h3>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Nombre</label>
            <input className="w-full p-3 bg-[#111] rounded text-white" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Descripción</label>
            <textarea className="w-full p-3 bg-[#111] rounded text-white" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Precio</label>
              <input type="number" step="0.01" className="w-full p-3 bg-[#111] rounded text-white" value={precio} onChange={(e) => setPrecio(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">URL Imagen</label>
              <input className="w-full p-3 bg-[#111] rounded text-white" value={imagen} onChange={(e) => setImagen(e.target.value)} />
            </div>
          </div>

          {error && <p className="text-red-400">{error}</p>}

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray-700">Cancelar</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-[#FFC72C] text-black font-bold">{saving ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </div>
      </form>
    </div>
  );
};
