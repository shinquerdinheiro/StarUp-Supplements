import { Id } from "../../convex/_generated/dataModel";

interface Product {
  _id: Id<"products">;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  weight: string;
  image: string;
  imageUrl?: string;
  badge?: string;
  rating: number;
  reviews: number;
  description: string;
  stock?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: Id<"products">) => void;
  onViewDetails: (productId: Id<"products">) => void;
}

export function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  return (
    <div className="bg-black border-2 border-red-600 rounded-lg p-6 hover:border-yellow-400 transition-all transform hover:scale-105">
      <div className="relative">
        {product.badge && (
          <span className="absolute -top-2 -right-2 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold z-10">
            {product.badge}
          </span>
        )}
        
        {/* Imagem do Produto */}
        <div 
          className="cursor-pointer mb-4"
          onClick={() => onViewDetails(product._id)}
        >
          {product.imageUrl ? (
            <div className="relative">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                <span className="text-white font-bold">🔍 Ver Detalhes</span>
              </div>
            </div>
          ) : (
            <div className="text-6xl text-center mb-4 hover:scale-110 transition-transform">
              {product.image}
            </div>
          )}
        </div>

        <h4 className="text-xl font-bold text-white mb-2">{product.name}</h4>
        <p className="text-gray-300 mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400">
            {'★'.repeat(Math.floor(product.rating))}
          </div>
          <span className="text-gray-400 ml-2">({product.reviews} avaliações)</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            {product.originalPrice && (
              <span className="text-gray-500 line-through text-lg">R$ {product.originalPrice.toFixed(2)}</span>
            )}
            <div className="text-2xl font-black text-red-500">R$ {product.price.toFixed(2)}</div>
            <div className="text-sm text-gray-400">{product.weight}</div>
          </div>
          {product.discount && (
            <div className="bg-red-600 text-white px-3 py-1 rounded-full font-bold">
              -{product.discount}%
            </div>
          )}
        </div>

        {/* Estoque */}
        {product.stock !== undefined && product.stock <= 10 && product.stock > 0 && (
          <div className="text-yellow-400 text-sm font-bold mb-2">
            ⚠️ Apenas {product.stock} unidades restantes!
          </div>
        )}

        {/* Botões */}
        <div className="space-y-2">
          <button 
            onClick={() => onViewDetails(product._id)}
            className="w-full bg-gray-700 text-white py-2 rounded-lg font-bold hover:bg-gray-600 transition-all"
          >
            👁️ VER DETALHES
          </button>
          <button 
            onClick={() => onAddToCart(product._id)}
            disabled={product.stock === 0}
            className={`w-full py-3 rounded-lg font-bold transition-all ${
              product.stock === 0
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800'
            }`}
          >
            {product.stock === 0 ? '❌ ESGOTADO' : '🛒 ADICIONAR AO CARRINHO'}
          </button>
        </div>
      </div>
    </div>
  );
}
