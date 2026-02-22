import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Trash2, Plus, Minus, ChefHat, ArrowLeft, Clock, Check } from 'lucide-react';
import { useState } from 'react';

export function Carrinho() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, total, itemsCount } = useCart();
  const [deliveryType, setDeliveryType] = useState<'entrega' | 'retirada'>('entrega');

  const deliveryFee = deliveryType === 'entrega' ? 2.0 : 0;
  const finalTotal = total + deliveryFee;

  const handleCheckout = () => {
    if (items.length === 0) {
      return;
    }

    // Navegar para checkout passando tipo de entrega
    navigate('/checkout', { state: { deliveryType } });
  };

  // Carrinho vazio
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-light flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="glass-card p-12 shadow-card">
            <div className="w-24 h-24 bg-primary/10 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-inner animate-bounce-subtle">
              <ChefHat className="text-primary" size={64} strokeWidth={1} />
            </div>
            <h2 className="font-display text-4xl text-accent-brown mb-4 tracking-tighter">
              Sua frigideira está vazia!
            </h2>
            <p className="text-gray-500 mb-10 font-medium italic">
              "O segredo de um bom almoço começa com a escolha do prato perfeito."
            </p>
            <button
              onClick={() => navigate('/cardapio')}
              className="btn-primary w-full py-5 text-lg"
            >
              Escolher meu almoço →
            </button>
          </div>
        </div>
      </div>
    );
  }
    return (
      <div className="min-h-screen bg-secondary-light py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <button
                  onClick={() => navigate('/cardapio')}
                  className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6 font-bold text-sm uppercase tracking-widest"
                >
                  <ArrowLeft size={18} />
                  <span>Voltar ao cardápio</span>
                </button>
                <h1 className="font-display text-5xl md:text-6xl text-accent-brown tracking-tight">
                  Seu pedido
                </h1>
              </div>
              
              <div className="flex items-center gap-4">
                 <div className="bg-white px-6 py-3 rounded-2xl shadow-soft border border-black/5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total de itens</p>
                    <p className="font-display text-2xl text-accent-brown leading-none">{itemsCount}</p>
                 </div>
                 <button
                    onClick={clearCart}
                    className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-4 rounded-2xl transition-all shadow-soft group"
                    title="Limpar carrinho"
                  >
                    <Trash2 size={24} className="group-hover:scale-110 transition-transform" />
                  </button>
              </div>
            </div>
  
            <div className="grid lg:grid-cols-3 gap-12 items-start">
              {/* Lista de Itens Refinada */}
              <div className="lg:col-span-2 space-y-6">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="glass-card p-6 md:p-8 flex flex-col sm:flex-row gap-8 items-center border-none shadow-soft group hover:shadow-card transition-all duration-500"
                  >
                    {/* Imagem do produto com sombra */}
                    <div className="w-40 h-40 bg-white rounded-[32px] flex-shrink-0 overflow-hidden shadow-card border-4 border-white group-hover:rotate-2 transition-transform duration-500">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary-light">
                          <ShoppingBag className="text-gray-300" size={48} />
                        </div>
                      )}
                    </div>
  
                    {/* Detalhes Estilizados */}
                    <div className="flex-1 w-full text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                        <div>
                          <h3 className="font-display text-2xl text-accent-brown mb-2">
                            {item.product.name}
                          </h3>
                          <div className="flex gap-2">
                             <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.type === 'prato'
                                ? 'bg-primary/10 text-primary border border-primary/20'
                                : 'bg-secondary/10 text-secondary border border-secondary/20'
                              }`}>
                               {item.type === 'prato' ? '🍽️ Prato Principal' : '🍰 Sobremesa'}
                             </span>
                          </div>
                        </div>
                        <div className="text-2xl font-display text-accent-brown">
                           R$ {(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
  
                      <p className="text-gray-500 text-sm mb-8 leading-relaxed italic">
                        "{item.product.description}"
                      </p>
  
                      <div className="flex items-center justify-between bg-secondary-light/50 p-3 rounded-2xl border border-black/5">
                        {/* Controle de quantidade Moderno */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-10 h-10 rounded-xl bg-white text-accent-brown hover:bg-primary hover:text-white shadow-soft transition-all flex items-center justify-center disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={18} />
                          </button>
                          <span className="w-12 text-center font-display text-xl text-accent-brown">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-10 h-10 rounded-xl bg-white text-accent-brown hover:bg-primary hover:text-white shadow-soft transition-all flex items-center justify-center"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
  
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-2"
                          title="Remover"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
  
              {/* Resumo do Pedido Estilo Glassmorphism */}
              <div className="lg:col-span-1">
                <div className="glass-card p-8 shadow-card sticky top-24 border-t-8 border-primary">
                  <h2 className="font-display text-3xl text-accent-brown mb-8">
                    Resumo
                  </h2>
  
                  {/* Tipo de entrega com novo design */}
                  <div className="mb-10">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                      Forma de entrega
                    </p>
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { id: 'entrega', icon: '🚚', label: 'Entrega', sub: 'Taxa R$ 2,00' },
                        { id: 'retirada', icon: '🏠', label: 'Retirada', sub: 'Grátis' }
                      ].map((opt) => (
                        <label
                          key={opt.id}
                          className={`flex items-center gap-4 p-5 rounded-[24px] border-2 cursor-pointer transition-all duration-300 ${deliveryType === opt.id
                              ? 'border-primary bg-primary/5 shadow-inner'
                              : 'border-gray-100 hover:border-gray-200 bg-white'
                            }`}
                        >
                          <input
                            type="radio"
                            name="deliveryType"
                            value={opt.id}
                            checked={deliveryType === opt.id}
                            onChange={(e) => setDeliveryType(e.target.value as 'entrega' | 'retirada')}
                            className="hidden"
                          />
                          <div className="text-3xl">{opt.icon}</div>
                          <div className="flex-1">
                            <p className="font-display text-lg text-accent-brown">{opt.label}</p>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter">{opt.sub}</p>
                          </div>
                          {deliveryType === opt.id && (
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white">
                               <Check size={14} strokeWidth={4} />
                            </div>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
  
                  {/* Valores Refinados */}
                  <div className="space-y-4 mb-10 bg-secondary-light/50 p-6 rounded-[32px] shadow-inner border border-white">
                    <div className="flex justify-between text-gray-500 font-medium">
                      <span>Subtotal</span>
                      <span>R$ {total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 font-medium">
                      <span>Taxa de entrega</span>
                      <span className={deliveryType === 'entrega' ? 'text-primary' : 'text-secondary'}>
                        {deliveryType === 'entrega' ? '+ R$ 2,00' : 'Grátis'}
                      </span>
                    </div>
                    <div className="border-t border-white pt-4 flex justify-between items-center">
                      <span className="font-display text-xl text-accent-brown">
                        Total
                      </span>
                      <span className="font-display text-4xl text-primary">
                        R$ {finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
  
                  {/* Botão finalizar Gigante */}
                  <button
                    onClick={handleCheckout}
                    className="btn-primary w-full py-6 text-xl mb-4 shadow-primary/30"
                  >
                    Finalizar Pedido →
                  </button>
  
                  <button
                    onClick={() => navigate('/cardapio')}
                    className="w-full py-4 text-accent-brown font-bold text-sm uppercase tracking-widest hover:text-primary transition-colors"
                  >
                    Continuar comprando
                  </button>
  
                  {/* Info Horários Estilizada */}
                  <div className="mt-10 p-6 bg-accent-brown rounded-[32px] text-white">
                    <div className="flex items-center gap-4 mb-4">
                       <Clock className="text-primary" size={24} />
                       <p className="font-display text-lg">Horários de hoje</p>
                    </div>
                    <div className="space-y-2 text-xs font-medium text-white/70">
                      <p className="flex justify-between"><span>Entregas:</span> <span className="text-white">11:30 - 13:30</span></p>
                      <p className="flex justify-between"><span>Retiradas:</span> <span className="text-white">11:00 - 14:00</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  