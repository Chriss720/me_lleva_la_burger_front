import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isLoading?: boolean;
  inCartCount?: number;
}

export const ProductCard = ({ product, onAddToCart, isLoading, inCartCount = 0 }: ProductCardProps) => {
  return (
    <div className="bg-[#1a1a1a] rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-[#333] flex flex-col h-full">
      <div className="bg-gray-800 h-72 flex items-center justify-center overflow-hidden relative group">
        {product.imagen || product.foto ? (
          <img
            src={product.imagen || product.foto}
            alt={product.nombre_producto}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="text-gray-500 text-center">
            <p className="text-lg">Sin imagen</p>
          </div>
        )}
        {inCartCount > 0 && (
          <div className="absolute top-4 right-4 bg-[#DA291C] text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
            {inCartCount} en carrito
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-[#FFC72C] font-bold text-2xl mb-3 leading-snug">{product.nombre_producto}</h3>
          <p className="text-gray-300 text-base line-clamp-3 leading-loose">{product.descripcion}</p>
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <div className="flex justify-between items-end border-t border-gray-700 pt-6">
            <span className="text-white font-bold text-3xl">${product.precio}</span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={isLoading}
            className="w-full bg-[#DA291C] text-white text-lg py-3 px-6 rounded-xl font-bold hover:bg-[#b91c1c] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-red-900/20"
          >
            {isLoading ? 'Agregando...' : 'Agregar al Carrito'}
          </button>
        </div>
      </div>
    </div>
  );
};
