import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isLoading?: boolean;
  inCartCount?: number;
}

export const ProductCard = ({ product, onAddToCart, isLoading, inCartCount = 0 }: ProductCardProps) => {
  return (
    <div className="bg-[#1a1a1a] rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-[#333]">
      <div className="bg-gray-700 h-48 flex items-center justify-center overflow-hidden">
        {product.imagen ? (
          <img src={product.imagen} alt={product.nombre_producto} className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-500 text-center">
            <p>Sin imagen</p>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[#FFC72C] font-bold text-lg mb-2">{product.nombre_producto}</h3>
          {inCartCount > 0 && (
            <span className="bg-[#DA291C] text-white text-xs font-bold px-2 py-1 rounded">En carrito: {inCartCount}</span>
          )}
        </div>
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{product.descripcion}</p>
        <div className="flex justify-between items-center">
          <span className="text-[#FFC72C] font-bold text-xl">${product.precio}</span>
          <button
            onClick={() => onAddToCart(product)}
            disabled={isLoading}
            className="bg-[#DA291C] text-white px-4 py-2 rounded-full font-bold hover:bg-[#a81f13] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Agregando...' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
};
