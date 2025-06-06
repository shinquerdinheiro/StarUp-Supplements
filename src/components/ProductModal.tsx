import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: Id<"products"> | null;
  onAddToCart: (productId: Id<"products">) => void;
}

export function ProductModal({ isOpen, onClose, productId, onAddToCart }: ProductModalProps) {
  const [selectedImage, setSelectedImage] = useState<'emoji' | 'url'>('emoji');
  const product = useQuery(api.products.getProduct, productId ? { productId } : "skip");

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    onAddToCart(product._id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-red-600 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-red-600">
          <h2 className="text-2xl font-black text-white">{product.name}</h2>
          <button 
            onClick={onClose}
            className="text-white text-3xl hover:text-red-500 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Imagens */}
            <div className="space-y-4">
              <div className="bg-black border-2 border-red-600 rounded-lg p-8 text-center">
                {selectedImage === 'emoji' ? (
                  <div className="text-8xl mb-4">{product.image}</div>
                ) : product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-8xl mb-4">{product.image}</div>
                )}
              </div>
              
              {product.imageUrl && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedImage('emoji')}
                    className={`flex-1 p-3 rounded border-2 transition-all ${
                      selectedImage === 'emoji' 
                        ? 'border-red-500 bg-red-500/20' 
                        : 'border-gray-600 hover:border-red-400'
                    }`}
                  >
                    <div className="text-3xl">{product.image}</div>
                  </button>
                  <button
                    onClick={() => setSelectedImage('url')}
                    className={`flex-1 p-3 rounded border-2 transition-all ${
                      selectedImage === 'url' 
                        ? 'border-red-500 bg-red-500/20' 
                        : 'border-gray-600 hover:border-red-400'
                    }`}
                  >
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-12 object-cover rounded"
                    />
                  </button>
                </div>
              )}
            </div>

            {/* Informações do Produto */}
            <div className="space-y-6">
              {/* Badges e Avaliação */}
              <div className="flex items-center justify-between">
                {product.badge && (
                  <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                    {product.badge}
                  </span>
                )}
                <div className="flex items-center">
                  <div className="flex text-yellow-400 mr-2">
                    {'★'.repeat(Math.floor(product.rating))}
                  </div>
                  <span className="text-gray-400">({product.reviews} avaliações)</span>
                </div>
              </div>

              {/* Preços */}
              <div className="space-y-2">
                {product.originalPrice && (
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-500 line-through text-xl">
                      R$ {product.originalPrice.toFixed(2)}
                    </span>
                    {product.discount && (
                      <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                        -{product.discount}% OFF
                      </span>
                    )}
                  </div>
                )}
                <div className="text-3xl font-black text-red-500">
                  R$ {product.price.toFixed(2)}
                </div>
                <div className="text-gray-400">{product.weight}</div>
                {product.originalPrice && (
                  <div className="text-green-400 font-bold">
                    💰 Economize R$ {(product.originalPrice - product.price).toFixed(2)}
                  </div>
                )}
              </div>

              {/* Estoque */}
              {product.stock !== undefined && (
                <div className="text-white">
                  <span className={`font-bold ${product.stock > 10 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {product.stock > 0 ? `${product.stock} unidades em estoque` : 'Produto esgotado'}
                  </span>
                </div>
              )}

              {/* Descrição */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">📋 Descrição</h3>
                  <p className="text-gray-300">{product.description}</p>
                  {product.detailedDescription && (
                    <p className="text-gray-300 mt-2">{product.detailedDescription}</p>
                  )}
                </div>

                {product.ingredients && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">🧪 Ingredientes</h3>
                    <p className="text-gray-300">{product.ingredients}</p>
                  </div>
                )}

                {product.usage && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">📖 Como Usar</h3>
                    <p className="text-gray-300">{product.usage}</p>
                  </div>
                )}
              </div>

              {/* Botão de Compra */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-4 rounded-lg text-xl font-bold transition-all ${
                  product.stock === 0
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transform hover:scale-105'
                }`}
              >
                {product.stock === 0 ? '❌ PRODUTO ESGOTADO' : '🛒 ADICIONAR AO CARRINHO'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
