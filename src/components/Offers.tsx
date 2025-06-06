import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { ProductCard } from "./ProductCard";

interface OffersProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (productId: Id<"products">) => void;
  onViewDetails: (productId: Id<"products">) => void;
}

export function Offers({ isOpen, onClose, onAddToCart, onViewDetails }: OffersProps) {
  const allProducts = useQuery(api.products.getAllProducts) || [];
  const offerProducts = allProducts.filter(product => 
    product.isOffer === true || (product.discount && product.discount > 0)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-red-600 rounded-lg p-6 max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black text-white">🔥 OFERTAS ESPECIAIS</h2>
          <button 
            onClick={onClose}
            className="text-white text-2xl hover:text-red-500"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {offerProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={onAddToCart}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>

        {offerProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-white text-xl">Nenhuma oferta disponível no momento</p>
            <p className="text-gray-400">Volte em breve para conferir nossas promoções!</p>
          </div>
        )}
      </div>
    </div>
  );
}
