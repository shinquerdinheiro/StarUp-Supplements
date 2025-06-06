import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function Cart({ isOpen, onClose, onCheckout }: CartProps) {
  const cartItems = useQuery(api.cart.getCart) || [];
  const updateQuantity = useMutation(api.cart.updateCartQuantity);
  const removeItem = useMutation(api.cart.removeFromCart);

  const total = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const handleQuantityChange = async (cartItemId: Id<"cart">, newQuantity: number) => {
    await updateQuantity({ cartItemId, quantity: newQuantity });
  };

  const handleRemoveItem = async (cartItemId: Id<"cart">) => {
    await removeItem({ cartItemId });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-red-600 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-white">🛒 SEU CARRINHO</h2>
          <button 
            onClick={onClose}
            className="text-white text-2xl hover:text-red-500"
          >
            ×
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-white text-xl">Seu carrinho está vazio</p>
            <p className="text-gray-400">Adicione produtos para continuar</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item._id} className="bg-black border border-red-600 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{item.product?.image}</div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold">{item.product?.name}</h3>
                      <p className="text-gray-400">{item.product?.weight}</p>
                      <p className="text-red-500 font-bold">R$ {item.product?.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        className="bg-red-600 text-white w-8 h-8 rounded hover:bg-red-700"
                      >
                        -
                      </button>
                      <span className="text-white font-bold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        className="bg-red-600 text-white w-8 h-8 rounded hover:bg-red-700"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="text-red-500 hover:text-red-400 ml-4"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-red-600 pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-white">Total:</span>
                <span className="text-2xl font-black text-red-500">R$ {total.toFixed(2)}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-bold hover:from-red-700 hover:to-red-800 transition-all"
              >
                🚀 FINALIZAR COMPRA
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
