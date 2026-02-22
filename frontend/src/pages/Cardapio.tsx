import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { menuApi } from '@/services/api';
import { DailyMenu } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Loader, AlertCircle, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Cardapio() {
  const [menu, setMenu] = useState<DailyMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { addItem, items, hasDish, hasDessert } = useCart();

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const response = await menuApi.getToday();

      if (!response.menu) {
        setError(response.message || 'Cardápio não disponível');
      } else {
        setMenu(response.menu);
      }
    } catch (err) {
      setError('Erro ao carregar cardápio. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDish = (dish: any) => {
    addItem(dish, 'prato');
  };

  const handleAddDessert = (dessert: any) => {
    addItem(dessert, 'sobremesa');
  };

  const isProductInCart = (productId: string) => {
    return items.some(item => item.product.id === productId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-light">
        <div className="text-center">
          <Loader className="animate-spin text-primary mx-auto mb-4" size={48} />
          <p className="text-gray-600 font-body">Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  if (error || !menu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-light px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-xl">
          <AlertCircle className="text-primary-dark mx-auto mb-4" size={64} />
          <h2 className="font-display text-2xl text-accent-brown mb-4">
            {error || 'Cardápio indisponível'}
          </h2>
          <p className="text-gray-600 mb-6">
            O cardápio de hoje ainda não foi atualizado. Volte mais tarde!
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-all"
          >
            Voltar para home
          </button>
        </div>
      </div>
    );
  }

  const today = new Date();
  const formattedDate = format(today, "EEEE, dd 'de' MMMM", { locale: ptBR });

  return (
    <div className="min-h-screen bg-secondary-light pb-32">
      {/* Header com Design Refinado */}
      <div className="relative overflow-hidden bg-accent-brown pt-16 pb-24 md:pt-20 md:pb-32">
        {/* Elemento Decorativo de Fundo */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white/90 text-xs font-bold uppercase tracking-widest mb-6 border border-white/10">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Cardápio de hoje
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl text-white capitalize mb-6 leading-tight">
              {formattedDate}
            </h1>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8">
              <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/5">
                <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary">
                   <Check size={20} />
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-none">{menu.availableSlots}</p>
                  <p className="text-white/50 text-xs uppercase tracking-tighter">Vagas restantes</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/5">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                   <AlertCircle size={20} />
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-none">{menu.ordersToday}</p>
                  <p className="text-white/50 text-xs uppercase tracking-tighter">Pedidos feitos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="max-w-6xl mx-auto">
          {/* Pratos Principais Refinados */}
          <section className="mb-16">
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[40px] p-8 md:p-12 shadow-soft relative overflow-hidden">
               <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                  <h2 className="font-display text-4xl md:text-5xl text-accent-brown mb-2 tracking-tight">
                    Escolha seu prato
                  </h2>
                  <p className="text-gray-500 font-medium">
                    Preparamos hoje com ingredientes frescos do mercado
                  </p>
                </div>
                <div className="flex -space-x-3">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden shadow-soft">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                     </div>
                   ))}
                   <div className="w-12 h-12 rounded-full border-4 border-white bg-primary text-white flex items-center justify-center text-xs font-bold shadow-soft">
                      +10
                   </div>
                   <span className="ml-4 self-center text-xs font-bold text-gray-400 uppercase tracking-widest">Pedindo agora</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {menu.dishes.map((dish) => {
                  const inCart = isProductInCart(dish.id);

                  return (
                    <div
                      key={dish.id}
                      className={`food-card group relative cursor-pointer ${inCart ? 'ring-4 ring-primary ring-offset-8' : ''}`}
                      onClick={() => handleAddDish(dish)}
                    >
                      {inCart && (
                        <div className="absolute top-6 right-6 bg-primary text-white rounded-2xl p-3 z-30 shadow-xl scale-110 animate-bounce-subtle">
                          <Check size={24} strokeWidth={3} />
                        </div>
                      )}

                      {dish.imageUrl && (
                        <div className="h-64 bg-gray-100 overflow-hidden relative">
                          <img
                            src={dish.imageUrl}
                            alt={dish.name}
                            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                          
                          <div className="absolute bottom-6 left-6 text-white">
                             <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20">
                                Prato do dia
                             </span>
                          </div>
                        </div>
                      )}

                      <div className="p-8">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-display text-2xl text-accent-brown group-hover:text-primary transition-colors">
                            {dish.name}
                          </h3>
                        </div>
                        
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed line-clamp-2 italic">
                          "{dish.description}"
                        </p>

                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Preço único</span>
                            <span className="text-3xl font-display text-accent-brown">
                              R$ {dish.price.toFixed(2)}
                            </span>
                          </div>
                          
                          <button
                            className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-md transform group-hover:scale-105 ${inCart
                                ? "bg-primary text-white shadow-primary/30"
                                : "bg-accent-brown text-white hover:bg-primary"
                              }`}
                          >
                            {inCart ? "Selecionado" : "Adicionar →"}
                          </button>
                        </div>

                        {dish.stock <= 5 && dish.stock > 0 && (
                          <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary animate-pulse">
                            <AlertCircle size={14} /> Corra! Restam apenas {dish.stock}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Sobremesas Refinadas */}
          <section className="mb-24">
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[40px] p-8 md:p-12 shadow-soft">
              <div className="mb-12">
                <h2 className="font-display text-4xl md:text-5xl text-accent-brown mb-2 tracking-tight">
                  Um toque doce
                </h2>
                <p className="text-gray-500 font-medium">
                  Complete sua experiência com nossas sobremesas caseiras
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {menu.desserts.map((dessert) => {
                  const inCart = isProductInCart(dessert.id);

                  return (
                    <div
                      key={dessert.id}
                      className={`food-card group relative cursor-pointer ${inCart ? 'ring-4 ring-secondary ring-offset-8' : ''}`}
                      onClick={() => handleAddDessert(dessert)}
                    >
                      {inCart && (
                        <div className="absolute top-6 right-6 bg-secondary text-white rounded-2xl p-3 z-30 shadow-xl scale-110 animate-bounce-subtle">
                          <Check size={24} strokeWidth={3} />
                        </div>
                      )}

                      {dessert.imageUrl && (
                        <div className="h-56 bg-gray-100 overflow-hidden relative">
                          <img
                            src={dessert.imageUrl}
                            alt={dessert.name}
                            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                          />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40 group-hover:opacity-20 transition-opacity"></div>
                        </div>
                      )}

                      <div className="p-8">
                        <h3 className="font-display text-2xl text-accent-brown group-hover:text-secondary transition-colors mb-3">
                          {dessert.name}
                        </h3>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed line-clamp-2">
                          {dessert.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Valor unitário</span>
                            <span className="text-3xl font-display text-secondary">
                              R$ {dessert.price.toFixed(2)}
                            </span>
                          </div>
                          
                          <button
                            className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-md transform group-hover:scale-105 ${inCart
                                ? "bg-secondary text-white shadow-secondary/30"
                                : "bg-accent-brown text-white hover:bg-secondary"
                              }`}
                          >
                            {inCart ? "Selecionada" : "Adicionar →"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Resumo e CTA Refinado Estilo Glassmorphism */}
          {(hasDish || hasDessert) && (
            <div className="fixed bottom-8 left-4 right-4 md:left-10 md:right-10 z-50 animate-slide-up">
              <div className="container mx-auto max-w-4xl glass-card p-6 md:p-8 shadow-card border-t-8 border-primary flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="hidden md:flex w-16 h-16 bg-primary/10 rounded-2xl items-center justify-center text-primary shadow-inner">
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                     </svg>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="font-display text-xl text-accent-brown mb-2 tracking-tight">
                       Seu combo está quase pronto!
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                      {hasDish ? (
                        <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold border border-primary/20">
                          <Check size={14} strokeWidth={3} /> Prato Escolhido
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 bg-gray-50 text-gray-400 px-4 py-2 rounded-full text-xs border border-gray-100 italic">
                          Aguardando prato...
                        </div>
                      )}
                      {hasDessert ? (
                        <div className="flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-xs font-bold border border-secondary/20">
                          <Check size={14} strokeWidth={3} /> Sobremesa Escolhida
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 bg-gray-50 text-gray-400 px-4 py-2 rounded-full text-xs border border-gray-100 italic">
                          Falta a sobremesa...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    if (!hasDish || !hasDessert) {
                      toast.error("Escolha 1 prato e 1 sobremesa para continuar");
                      return;
                    }
                    navigate("/carrinho");
                  }}
                  onMouseEnter={() => (window as any).prefetchPage?.('carrinho')}
                  disabled={!hasDish || !hasDessert}
                  className="bg-primary hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-5 px-12 rounded-3xl transition-all shadow-xl hover:shadow-primary/30 transform hover:-translate-y-1 active:scale-95 whitespace-nowrap w-full md:w-auto text-lg"
                >
                  {hasDish && hasDessert
                    ? "Finalizar Pedido →"
                    : "Complete seu combo"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
