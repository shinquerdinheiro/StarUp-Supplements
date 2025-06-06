import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Checkout({ isOpen, onClose }: CheckoutProps) {
  const cartItems = useQuery(api.cart.getCart) || [];
  const createOrder = useMutation(api.orders.createOrder);
  const clearCart = useMutation(api.cart.clearCart);

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    cpf: "",
    email: "",
    phone: "",
    address: {
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [shippingMethod, setShippingMethod] = useState("pac");

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const shippingCost = subtotal >= 199 ? 0 : shippingMethod === "sedex" ? 25 : 15;
  const total = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const orderItems = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product?.price || 0,
        name: item.product?.name || "",
      }));

      const orderId = await createOrder({
        customerInfo,
        paymentMethod,
        shippingMethod,
        items: orderItems,
        total,
        shippingCost,
      });

      await clearCart();
      toast.success("Pedido criado com sucesso!");
      onClose();
      
      // Aqui você pode redirecionar para uma página de confirmação
      console.log("Order ID:", orderId);
    } catch (error) {
      toast.error("Erro ao criar pedido");
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-red-600 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-white">🚀 FINALIZAR COMPRA</h2>
          <button 
            onClick={onClose}
            className="text-white text-2xl hover:text-red-500"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="bg-black border border-red-600 rounded-lg p-4">
            <h3 className="text-xl font-bold text-white mb-4">📋 Dados Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nome Completo"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                className="w-full px-4 py-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-red-500"
                required
              />
              <input
                type="text"
                placeholder="CPF"
                value={customerInfo.cpf}
                onChange={(e) => setCustomerInfo({...customerInfo, cpf: e.target.value})}
                className="w-full px-4 py-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-red-500"
                required
              />
              <input
                type="email"
                placeholder="E-mail"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                className="w-full px-4 py-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-red-500"
                required
              />
              <input
                type="tel"
                placeholder="Telefone"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                className="w-full px-4 py-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-red-500"
                required
              />
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-black border border-red-600 rounded-lg p-4">
            <h3 className="text-xl font-bold text-white mb-4">📍 Endereço de Entrega</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="CEP"
                value={customerInfo.address.zipCode}
                onChange={(e) => setCustomerInfo({
                  ...customerInfo,
                  address: {...customerInfo.address, zipCode: e.target.value}
                })}
                className="w-full px-4 py-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-red-500"
                required
              />
              <input
                type="text"
                placeholder="Rua"
                value={customerInfo.address.street}
                onChange={(e) => setCustomerInfo({
                  ...customerInfo,
                  address: {...customerInfo.address, street: e.target.value}
                })}
                className="w-full px-4 py-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-red-500"
                required
              />
              <input
                type="text"
                placeholder="Número"
                value={customerInfo.address.number}
                onChange={(e) => setCustomerInfo({
                  ...customerInfo,
                  address: {...customerInfo.address, number: e.target.value}
                })}
                className="w-full px-4 py-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-red-500"
                required
              />
              <input
                type="text"
                placeholder="Complemento (opcional)"
                value={customerInfo.address.complement}
                onChange={(e) => setCustomerInfo({
                  ...customerInfo,
                  address: {...customerInfo.address, complement: e.target.value}
                })}
                className="w-full px-4 py-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-red-500"
              />
              <input
                type="text"
                placeholder="Bairro"
                value={customerInfo.address.neighborhood}
                onChange={(e) => setCustomerInfo({
                  ...customerInfo,
                  address: {...customerInfo.address, neighborhood: e.target.value}
                })}
                className="w-full px-4 py-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-red-500"
                required
              />
              <input
                type="text"
                placeholder="Cidade"
                value={customerInfo.address.city}
                onChange={(e) => setCustomerInfo({
                  ...customerInfo,
                  address: {...customerInfo.address, city: e.target.value}
                })}
                className="w-full px-4 py-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-red-500"
                required
              />
              <input
                type="text"
                placeholder="Estado"
                value={customerInfo.address.state}
                onChange={(e) => setCustomerInfo({
                  ...customerInfo,
                  address: {...customerInfo.address, state: e.target.value}
                })}
                className="w-full px-4 py-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-red-500"
                required
              />
            </div>
          </div>

          {/* Frete */}
          <div className="bg-black border border-red-600 rounded-lg p-4">
            <h3 className="text-xl font-bold text-white mb-4">🚚 Opções de Frete</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 text-white">
                <input
                  type="radio"
                  value="pac"
                  checked={shippingMethod === "pac"}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="text-red-500"
                />
                <span>PAC - R$ 15,00 (5-7 dias úteis)</span>
              </label>
              <label className="flex items-center space-x-3 text-white">
                <input
                  type="radio"
                  value="sedex"
                  checked={shippingMethod === "sedex"}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="text-red-500"
                />
                <span>SEDEX - R$ 25,00 (2-3 dias úteis)</span>
              </label>
              {subtotal >= 199 && (
                <p className="text-green-400 font-bold">🎉 Frete GRÁTIS! (compras acima de R$ 199)</p>
              )}
            </div>
          </div>

          {/* Pagamento */}
          <div className="bg-black border border-red-600 rounded-lg p-4">
            <h3 className="text-xl font-bold text-white mb-4">💳 Forma de Pagamento</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 text-white">
                <input
                  type="radio"
                  value="pix"
                  checked={paymentMethod === "pix"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-red-500"
                />
                <span>PIX (5% de desconto)</span>
              </label>
              <label className="flex items-center space-x-3 text-white">
                <input
                  type="radio"
                  value="cartao"
                  checked={paymentMethod === "cartao"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-red-500"
                />
                <span>Cartão de Crédito (até 12x sem juros)</span>
              </label>
              <label className="flex items-center space-x-3 text-white">
                <input
                  type="radio"
                  value="boleto"
                  checked={paymentMethod === "boleto"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-red-500"
                />
                <span>Boleto Bancário</span>
              </label>
            </div>
          </div>

          {/* Resumo */}
          <div className="bg-black border border-red-600 rounded-lg p-4">
            <h3 className="text-xl font-bold text-white mb-4">📊 Resumo do Pedido</h3>
            <div className="space-y-2 text-white">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete:</span>
                <span>{shippingCost === 0 ? "GRÁTIS" : `R$ ${shippingCost.toFixed(2)}`}</span>
              </div>
              {paymentMethod === "pix" && (
                <div className="flex justify-between text-green-400">
                  <span>Desconto PIX (5%):</span>
                  <span>-R$ {(total * 0.05).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-red-600 pt-2 flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span className="text-red-500">
                  R$ {paymentMethod === "pix" ? (total * 0.95).toFixed(2) : total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-lg text-xl font-bold hover:from-red-700 hover:to-red-800 transition-all"
          >
            🔥 CONFIRMAR PEDIDO
          </button>
        </form>
      </div>
    </div>
  );
}
