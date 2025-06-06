import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface ContactProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Contact({ isOpen, onClose }: ContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const submitContact = useMutation(api.contact.submitContact);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await submitContact(formData);
      toast.success("Mensagem enviada com sucesso!");
      setFormData({ name: "", email: "", subject: "", message: "" });
      onClose();
    } catch (error) {
      toast.error("Erro ao enviar mensagem");
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-red-600 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-white">📞 CONTATO</h2>
          <button 
            onClick={onClose}
            className="text-white text-2xl hover:text-red-500"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Informações de Contato */}
          <div className="bg-black border border-red-600 rounded-lg p-4">
            <h3 className="text-xl font-bold text-white mb-4">📱 Fale Conosco</h3>
            <div className="space-y-4">
              <a 
                href="https://api.whatsapp.com/send?phone=5511999999999&text=Olá! Gostaria de saber mais sobre os produtos."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-green-400 hover:text-green-300"
              >
                <span className="text-2xl">📱</span>
                <div>
                  <div className="font-bold">WhatsApp</div>
                  <div className="text-sm">(11) 99999-9999</div>
                </div>
              </a>
              
              <a 
                href="mailto:contato@beastsupplements.com"
                className="flex items-center space-x-3 text-blue-400 hover:text-blue-300"
              >
                <span className="text-2xl">📧</span>
                <div>
                  <div className="font-bold">E-mail</div>
                  <div className="text-sm">contato@beastsupplements.com</div>
                </div>
              </a>
              
              <a 
                href="https://instagram.com/beastsupplements"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-pink-400 hover:text-pink-300"
              >
                <span className="text-2xl">📸</span>
                <div>
                  <div className="font-bold">Instagram</div>
                  <div className="text-sm">@beastsupplements</div>
                </div>
              </a>
            </div>
          </div>

          {/* Formulário */}
          <div className="bg-black border border-red-600 rounded-lg p-4">
            <h3 className="text-xl font-bold text-white mb-4">✉️ Envie sua Mensagem</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Seu Nome"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-red-500"
                required
              />
              
              <input
                type="email"
                placeholder="Seu E-mail"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-red-500"
                required
              />
              
              <input
                type="text"
                placeholder="Assunto"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-4 py-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-red-500"
                required
              />
              
              <textarea
                placeholder="Sua Mensagem"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-red-500 resize-none"
                required
              />
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-bold hover:from-red-700 hover:to-red-800 transition-all"
              >
                🚀 ENVIAR MENSAGEM
              </button>
            </form>
          </div>
        </div>

        {/* Horário de Atendimento */}
        <div className="bg-black border border-red-600 rounded-lg p-4">
          <h3 className="text-xl font-bold text-white mb-4">🕒 Horário de Atendimento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
            <div>
              <div className="font-bold text-yellow-400">Segunda a Sexta</div>
              <div>08:00 às 18:00</div>
            </div>
            <div>
              <div className="font-bold text-yellow-400">Sábado</div>
              <div>08:00 às 14:00</div>
            </div>
          </div>
          <p className="text-gray-400 mt-2">
            💬 WhatsApp disponível 24h para dúvidas rápidas!
          </p>
        </div>
      </div>
    </div>
  );
}
