import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Check, Clock, MapPin, Utensils, ChefHat, ShoppingBag } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToId) {
      const element = document.getElementById(location.state.scrollToId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Clear the state to prevent re-scrolling on subsequent renders
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-secondary-light selection:bg-primary/30">
      {/* Hero Section Premium */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Decorativos de fundo */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -z-10"></div>

        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="animate-fade-in text-center lg:text-left order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-soft mb-8 border border-black/5">
                   <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-accent-brown">Sabor caseiro autêntico</span>
                </div>
                
                <h1 className="font-display text-6xl md:text-7xl lg:text-8xl text-accent-brown leading-[0.9] mb-8 tracking-tighter">
                  Comida <span className="text-primary italic">fresquinha</span> feita com <span className="underline decoration-secondary/30 underline-offset-8">amor.</span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-10 font-body leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Resgatamos o prazer do almoço caseiro. Escolha seu combo do dia e receba no conforto da sua casa ou trabalho.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                  <button
                    onClick={() => navigate('/cardapio')}
                    onMouseEnter={() => (window as any).prefetchPage?.('cardapio')}
                    className="btn-primary flex items-center justify-center gap-3 text-lg"
                  >
                    Explorar Cardápio
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </button>
                  <button
                    onClick={() => {
                      document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-8 py-4 rounded-full border-2 border-accent-brown text-accent-brown font-bold hover:bg-accent-brown hover:text-white transition-all duration-300"
                  >
                    Ver processo
                  </button>
                </div>
                
                <div className="mt-12 flex items-center justify-center lg:justify-start gap-8">
                   <div className="text-center lg:text-left">
                      <p className="font-display text-2xl text-accent-brown">30+</p>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Pratos Diários</p>
                   </div>
                   <div className="w-px h-10 bg-gray-200"></div>
                   <div className="text-center lg:text-left">
                      <p className="font-display text-2xl text-accent-brown">100%</p>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Artesanal</p>
                   </div>
                   <div className="w-px h-10 bg-gray-200"></div>
                   <div className="text-center lg:text-left">
                      <p className="font-display text-2xl text-accent-brown">4.9/5</p>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Avaliações</p>
                   </div>
                </div>
              </div>

              <div className="relative animate-slide-up order-1 lg:order-2">
                <div className="relative z-10 group">
                  <div className="absolute inset-0 bg-primary/20 rounded-[60px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
                  <div className="bg-white p-6 rounded-[60px] shadow-card transform -rotate-2 group-hover:rotate-0 transition-transform duration-700">
                    <div className="rounded-[40px] overflow-hidden aspect-[4/5] bg-secondary-light relative">
                      <img
                        src="/logo-principal.png"
                        alt="Logo Frigideira"
                        className="w-full h-full object-cover scale-90 group-hover:scale-100 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  </div>
                </div>
                
                {/* Badge Flutuante */}
                <div className="absolute -bottom-8 -left-8 glass-card p-6 shadow-card animate-bounce-subtle z-20 hidden md:block border-t-4 border-secondary">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="font-display text-lg text-accent-brown">Entrega Rápida</p>
                      <p className="text-xs text-gray-500 font-medium">Das 11:30 às 13:30</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona - Minimalista & Elegante */}
      <section className="bg-white py-32 relative overflow-hidden" id="como-funciona">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-24">
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-4 block">Passo a passo</span>
              <h2 className="font-display text-5xl md:text-6xl text-accent-brown mb-6 tracking-tight">
                Simples como comer em casa
              </h2>
              <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-16">
              {[
                { icon: <Utensils size={32} />, title: "Escolha seu Combo", desc: "Selecione o prato do dia e sua sobremesa favorita em nosso cardápio atualizado." },
                { icon: <ChefHat size={32} />, title: "Pedido Online", desc: "Finalize seu pedido em segundos. Aceitamos Pix para sua total comodidade." },
                { icon: <MapPin size={32} />, title: "Sinta o Sabor", desc: "Receba quentinho onde você estiver ou retire em nosso ponto de atendimento." }
              ].map((step, idx) => (
                <div key={idx} className="relative group text-center md:text-left">
                  <div className="mb-8 relative inline-block">
                    <div className="w-20 h-20 bg-secondary-light rounded-3xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 transform group-hover:rotate-12 shadow-soft">
                      {step.icon}
                    </div>
                    <span className="absolute -top-4 -right-4 w-10 h-10 bg-accent-brown text-white rounded-full flex items-center justify-center font-display text-xl border-4 border-white">
                      {idx + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl text-accent-brown mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Seção "Por Que" com Cards Glass */}
      <section className="py-32 bg-secondary-light relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <div className="relative">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-6 pt-12">
                       <div className="glass-card p-8 shadow-soft border-l-4 border-primary">
                          <p className="font-display text-3xl text-primary mb-2">100%</p>
                          <p className="text-sm font-bold text-accent-brown uppercase tracking-tighter">Natural</p>
                       </div>
                       <div className="glass-card p-8 shadow-soft border-l-4 border-secondary">
                          <p className="font-display text-3xl text-secondary mb-2">Fresco</p>
                          <p className="text-sm font-bold text-accent-brown uppercase tracking-tighter">Diário</p>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <div className="glass-card p-8 shadow-soft border-l-4 border-accent-brown">
                          <p className="font-display text-3xl text-accent-brown mb-2">Afeto</p>
                          <p className="text-sm font-bold text-accent-brown uppercase tracking-tighter">No Tempero</p>
                       </div>
                       <div className="glass-card p-8 shadow-soft border-l-4 border-primary-light">
                          <p className="font-display text-3xl text-primary-light mb-2">Rápido</p>
                          <p className="text-sm font-bold text-accent-brown uppercase tracking-tighter">No Envio</p>
                       </div>
                    </div>
                  </div>
               </div>
               
               <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-secondary mb-4 block">Nossa Essência</span>
                  <h2 className="font-display text-5xl md:text-6xl text-accent-brown mb-8 leading-tight tracking-tight">
                    O segredo está no <span className="italic">tempero</span> de família.
                  </h2>
                  <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                    Não somos apenas um delivery. Somos a extensão da sua cozinha. Cada quentinha é montada individualmente, garantindo que o feijão esteja cremoso e o arroz soltinho, como deve ser.
                  </p>
                  <ul className="space-y-4 mb-12">
                     {["Ingredientes selecionados no dia", "Sem conservantes ou temperos prontos", "Embalagens que mantêm a temperatura", "Respeito total ao horário de entrega"].map((item, i) => (
                       <li key={i} className="flex items-center gap-3 text-accent-brown font-bold">
                          <div className="w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center">
                             <Check size={14} strokeWidth={4} />
                          </div>
                          {item}
                       </li>
                     ))}
                  </ul>
                  <button onClick={() => navigate('/cardapio')} className="btn-primary">
                    Provar essa delícia
                  </button>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Horários Estilizados com Imagem de Fundo */}
      <section className="bg-white py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto glass-card overflow-hidden shadow-card border-none flex flex-col md:flex-row relative">
             {/* Imagem de Fundo com Mais Brilho (Overlay Reduzido) */}
             <div className="absolute inset-0 md:w-1/2 -z-10">
                <img 
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000" 
                  alt="Cozinha Caseira" 
                  className="w-full h-full object-cover"
                />
                {/* Overlay reduzido para 40% para a imagem aparecer mais */}
                <div className="absolute inset-0 bg-black/40"></div>
             </div>
             
             <div className="p-12 md:w-1/2 flex flex-col justify-center relative z-10">
                <h2 className="font-display text-5xl mb-6 leading-tight text-white">
                  Sabor que respeita o <span className="text-primary italic">tempo</span>.
                </h2>
                <p className="text-white leading-relaxed mb-8 font-medium drop-shadow-md">
                  Trabalhamos com encomendas antecipadas para garantir que cada ingrediente mantenha seu frescor absoluto e sabor original.
                </p>
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 shadow-xl">
                   <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                      <Clock size={28} strokeWidth={2.5} />
                   </div>
                   <div>
                      <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary-light mb-1">Aviso Importante</p>
                      <p className="text-lg font-bold leading-none text-white">Pedidos até às 10:00h!</p>
                   </div>
                </div>
             </div>
             
             <div className="p-12 md:w-1/2 bg-secondary-light/40 backdrop-blur-xl border-l border-white/20">
                <div className="grid gap-10">
                   {[
                     { label: "Funcionamento", val: "Segunda a Sábado", icon: <Clock /> },
                     { label: "Entregas", val: "11:30 às 13:30", icon: <MapPin /> },
                     { label: "Retiradas", val: "11:00 às 14h:00", icon: <ShoppingBag /> }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center gap-6 group">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-soft flex items-center justify-center text-primary transform group-hover:scale-110 transition-transform">
                           {item.icon}
                        </div>
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{item.label}</p>
                           <p className="font-display text-2xl text-accent-brown">{item.val}</p>
                        </div>
                     </div>
                   ))}
                </div>
                <p className="mt-12 text-xs italic text-gray-400 font-medium border-t pt-8 border-gray-100">
                  * Domingos e feriados: Fechado para descanso da equipe.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Final Estilo Banner */}
      <section className="container mx-auto px-4 py-32">
        <div className="relative rounded-[60px] bg-primary overflow-hidden p-12 md:p-24 text-center shadow-card">
           {/* Efeito de brilho de fundo */}
           <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/20 rounded-full blur-[100px]"></div>
           <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-accent-brown/20 rounded-full blur-[100px]"></div>
           
           <div className="relative z-10 max-w-3xl mx-auto">
             <h2 className="font-display text-5xl md:text-7xl text-white mb-8 leading-tight tracking-tight">
               Sua quentinha está a poucos <span className="text-accent-brown">cliques</span> daqui.
             </h2>
             <p className="text-xl text-white/90 mb-12 font-medium">
               Não deixe para a última hora. Garanta agora o seu almoço fresquinho e saboroso.
             </p>
             <button
               onClick={() => navigate('/cardapio')}
               className="bg-accent-brown text-white hover:bg-white hover:text-accent-brown font-bold py-6 px-16 rounded-full text-2xl transition-all duration-300 shadow-2xl active:scale-95"
             >
               Pedir agora
             </button>
             <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/70 text-sm font-bold">
                <span className="flex items-center gap-2 italic">#ComidaCaseira</span>
                <span className="flex items-center gap-2 italic">#FeitoComAmor</span>
                <span className="flex items-center gap-2 italic">#FrigideiraRealengo</span>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
}
