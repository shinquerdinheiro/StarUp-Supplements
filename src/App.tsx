import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";
import { Cart } from "./components/Cart";
import { Checkout } from "./components/Checkout";
import { Offers } from "./components/Offers";
import { Contact } from "./components/Contact";
import { ProductModal } from "./components/ProductModal";
import { ProductCard } from "./components/ProductCard";
import { toast } from "sonner";
import { Id } from "../convex/_generated/dataModel";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Authenticated>
        <SupplementStore />
      </Authenticated>
      <Unauthenticated>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="max-w-md w-full mx-4">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className="text-4xl">💪</span>
                <h1 className="text-3xl font-black text-red-500">BEAST SUPPLEMENTS</h1>
              </div>
              <p className="text-gray-400">Faça login para acessar nossa loja</p>
            </div>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
      <Toaster />
    </div>
  );
}

export function SupplementStore() {
  const userInfo = useQuery(api.auth.loggedInUser);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 15, seconds: 9 });
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOffers, setShowOffers] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<Id<"products"> | null>(null);
  
  const featuredProducts = useQuery(api.products.getFeaturedProducts);
  const seedProducts = useMutation(api.products.seedProducts);
  const addToCart = useMutation(api.cart.addToCart);
  const cartItems = useQuery(api.cart.getCart) || [];

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (featuredProducts?.length === 0) {
      seedProducts();
    }
  }, [featuredProducts, seedProducts]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    const popupTimer = setTimeout(() => setShowEmailPopup(true), 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(popupTimer);
    };
  }, []);

  const handleAddToCart = async (productId: Id<"products">) => {
    try {
      await addToCart({ productId, quantity: 1 });
      toast.success("Produto adicionado ao carrinho!");
    } catch (error) {
      toast.error("Erro ao adicionar produto");
      console.error(error);
    }
  };

  const handleViewDetails = (productId: Id<"products">) => {
    setSelectedProductId(productId);
    setShowProductModal(true);
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  return (
    <>
      {userInfo ? (
        <div>
          Logado como: {userInfo.email}
          <SignOutButton />
        </div>
      ) : (
        <div>Você não está logado.</div>
      )}
    {/* Barra de Promoção Fixa */}
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-2 px-4 text-center font-bold animate-pulse">
      🔥 WHEY 900G a partir de R$38,90 | FRETE GRÁTIS ACIMA DE R$199 🔥
    </div>

      {/* Header */}
      <header className="bg-black border-b-2 border-red-600 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">💪</span>
            <h1 className="text-2xl font-black text-red-500">BEAST SUPPLEMENTS</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#produtos" className="text-white hover:text-yellow-400 font-semibold">PRODUTOS</a>
            <button 
              onClick={() => setShowOffers(true)}
              className="text-white hover:text-yellow-400 font-semibold"
            >
              OFERTAS
            </button>
            <button 
              onClick={() => setShowContact(true)}
              className="text-white hover:text-yellow-400 font-semibold"
            >
              CONTATO
            </button>
          </nav>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowCart(true)}
              className="bg-yellow-400 text-black px-4 py-2 rounded font-bold hover:bg-yellow-300 relative"
            >
              🛒 CARRINHO
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  {cartItemCount}
                </span>
              )}
            </button>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Banner Principal */}
      <section className="bg-gradient-to-r from-red-900 via-black to-red-900 py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff0000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
            🔥 GANHE MASSA
            <span className="text-red-500"> RÁPIDO!</span>
          </h2>
          <p className="text-2xl md:text-3xl text-yellow-400 font-bold mb-8">
            ATÉ 50% OFF EM SUPLEMENTOS
          </p>
          <div className="bg-black/80 border-2 border-red-500 rounded-lg p-6 mb-8 inline-block">
            <p className="text-xl text-white mb-4">⏳ Promoção termina em:</p>
            <div className="flex justify-center space-x-4 text-3xl font-black">
              <div className="bg-red-600 px-4 py-2 rounded">
                <span className="text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                <div className="text-xs text-gray-300">HORAS</div>
              </div>
              <div className="bg-red-600 px-4 py-2 rounded">
                <span className="text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <div className="text-xs text-gray-300">MIN</div>
              </div>
              <div className="bg-red-600 px-4 py-2 rounded">
                <span className="text-white">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <div className="text-xs text-gray-300">SEG</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <button 
              onClick={() => setShowOffers(true)}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-12 py-4 rounded-lg text-2xl font-black hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all shadow-lg"
            >
              ⚡ COMPRAR AGORA
            </button>
            <p className="text-yellow-400 text-lg font-semibold">
              💪 Compre Whey + Creatina e leve BCAA com 40% de desconto!
            </p>
          </div>
        </div>
      </section>

      {/* Produtos em Destaque */}
      <section id="produtos" className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto">
          <h3 className="text-4xl font-black text-center text-white mb-12">
            🏆 PRODUTOS <span className="text-red-500">CAMPEÕES</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredProducts?.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Confiança */}
      <section className="py-16 px-4 bg-black">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-black text-white mb-12">
            🛡️ COMPRA <span className="text-red-500">100% SEGURA</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 border border-red-600 rounded-lg p-6">
              <div className="text-4xl mb-4">🔒</div>
              <h4 className="text-xl font-bold text-white mb-2">Site 100% Seguro</h4>
              <p className="text-gray-300">Certificado SSL e pagamento protegido</p>
            </div>
            <div className="bg-gray-900 border border-red-600 rounded-lg p-6">
              <div className="text-4xl mb-4">🚚</div>
              <h4 className="text-xl font-bold text-white mb-2">Entrega Rápida</h4>
              <p className="text-gray-300">Frete grátis acima de R$199</p>
            </div>
            <div className="bg-gray-900 border border-red-600 rounded-lg p-6">
              <div className="text-4xl mb-4">💳</div>
              <h4 className="text-xl font-bold text-white mb-2">Pagamento Fácil</h4>
              <p className="text-gray-300">PIX, Cartão ou Boleto</p>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto">
          <h3 className="text-3xl font-black text-center text-white mb-12">
            💬 O QUE DIZEM OS <span className="text-red-500">ATLETAS</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black border border-red-600 rounded-lg p-6">
              <div className="flex text-yellow-400 mb-4">★★★★★</div>
              <p className="text-white mb-4">"Melhor whey que já usei! Resultados em 2 semanas!"</p>
              <p className="text-gray-400">- Carlos, 28 anos</p>
            </div>
            <div className="bg-black border border-red-600 rounded-lg p-6">
              <div className="flex text-yellow-400 mb-4">★★★★★</div>
              <p className="text-white mb-4">"Creatina top! Força aumentou muito nos treinos."</p>
              <p className="text-gray-400">- Marina, 25 anos</p>
            </div>
            <div className="bg-black border border-red-600 rounded-lg p-6">
              <div className="flex text-yellow-400 mb-4">★★★★★</div>
              <p className="text-white mb-4">"Entrega super rápida e produtos originais!"</p>
              <p className="text-gray-400">- Roberto, 32 anos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t-2 border-red-600 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <span className="text-3xl">💪</span>
            <h1 className="text-2xl font-black text-red-500">BEAST SUPPLEMENTS</h1>
          </div>
          <p className="text-gray-400 mb-4">Transforme seu corpo, supere seus limites!</p>
          <div className="flex justify-center space-x-6 text-gray-400">
            <a href="#" className="hover:text-red-500">Política de Privacidade</a>
            <a href="#" className="hover:text-red-500">Termos de Uso</a>
            <button 
              onClick={() => setShowContact(true)}
              className="hover:text-red-500"
            >
              Contato
            </button>
          </div>
        </div>
      </footer>

      {/* Popup de Email */}
      {showEmailPopup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-r from-red-900 to-black border-2 border-yellow-400 rounded-lg p-8 max-w-md w-full text-center relative">
            <button 
              onClick={() => setShowEmailPopup(false)}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              ×
            </button>
            <div className="text-4xl mb-4">🎁</div>
            <h3 className="text-2xl font-black text-white mb-4">
              GANHE 10% OFF
            </h3>
            <p className="text-yellow-400 mb-6">Na sua primeira compra!</p>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded bg-white text-black mb-4"
            />
            <button 
              onClick={() => setShowEmailPopup(false)}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded font-bold hover:from-red-700 hover:to-red-800"
            >
              QUERO MEU DESCONTO!
            </button>
          </div>
        </div>
      )}

      {/* Botão Flutuante WhatsApp */}
      <div className="fixed bottom-6 right-6 z-40">
        <a 
          href="https://api.whatsapp.com/send?phone=5511999999999&text=Olá! Gostaria de saber mais sobre os produtos."
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 animate-bounce block"
        >
          <span className="text-2xl">📱</span>
        </a>
      </div>

      {/* Modals */}
      <Cart 
        isOpen={showCart} 
        onClose={() => setShowCart(false)} 
        onCheckout={handleCheckout}
      />
      
      <Checkout 
        isOpen={showCheckout} 
        onClose={() => setShowCheckout(false)} 
      />
      
      <Offers 
        isOpen={showOffers} 
        onClose={() => setShowOffers(false)} 
        onAddToCart={handleAddToCart}
        onViewDetails={handleViewDetails}
      />
      
      <Contact 
        isOpen={showContact} 
        onClose={() => setShowContact(false)} 
      />

      <ProductModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        productId={selectedProductId}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}
