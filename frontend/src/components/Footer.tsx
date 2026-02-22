import { Link, useNavigate, useLocation } from "react-router-dom";
import { Instagram, Facebook, Clock, Phone, Mail, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollToSection = (sectionId: string) => {
    if (location.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollToId: sectionId } });
    }
  };

  return (
    <footer className="bg-accent-brown text-white mt-20 border-t-8 border-primary">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Logo e descrição */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-6 group" onMouseEnter={() => (window as any).prefetchPage?.('home')}>
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-card group-hover:rotate-6 transition-transform">
                <img
                  src="/home.svg"
                  alt="Frigideira Logo"
                  className="w-14 h-14 object-contain"
                />
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed font-medium">
              O autêntico sabor da comida caseira, preparado com ingredientes frescos e muito carinho para o seu dia a dia.
            </p>
          </div>

          {/* Menu com Scroll Suave */}
          <div>
            <h3 className="font-display text-xl mb-6 text-primary">Menu</h3>
            <ul className="space-y-4">
              <li>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-white/70 hover:text-white transition-colors font-medium flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Início
                </button>
              </li>
              <li>
                <Link 
                  to="/cardapio" 
                  onMouseEnter={() => (window as any).prefetchPage?.('cardapio')}
                  className="text-white/70 hover:text-white transition-colors font-medium flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Cardápio
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => handleScrollToSection('como-funciona')}
                  className="text-white/70 hover:text-white transition-colors font-medium flex items-center gap-2 text-left"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Como Funciona
                </button>
              </li>
            </ul>
          </div>

          {/* Contato Estilizado */}
          <div>
            <h3 className="font-display text-xl mb-6 text-primary">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-white/70 text-sm group">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Phone size={14} />
                </div>
                (21) 97265-7221
              </li>
              <li className="flex items-center gap-3 text-white/70 text-sm group">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Mail size={14} />
                </div>
                robertofernandes144@gmail.com
              </li>
              <li className="flex items-start gap-3 text-white/70 text-sm group">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all mt-1">
                  <MapPin size={14} />
                </div>
                <span>Rua Recife, 873<br />Realengo - Rio de Janeiro/RJ</span>
              </li>
            </ul>
          </div>

          {/* Redes Sociais e Horários */}
          <div>
            <h3 className="font-display text-xl mb-6 text-primary flex items-center gap-2">
              <Clock size={20} />
              Horários
            </h3>
            
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
              <ul className="space-y-2 text-sm text-white/70 font-medium">
                <li className="flex justify-between"><span>Segunda a Sábado</span> <span className="text-white">Aberto</span></li>
                <li className="flex justify-between"><span>Pedidos até:</span> <span className="text-white font-bold">10:00h</span></li>
                <li className="flex justify-between"><span>Entregas:</span> <span className="text-white">11:30 - 13:30</span></li>
              </ul>

              <div className="flex gap-4 mt-8">
                <a
                  href="https://instagram.com/seuPerfil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white transition-all bg-white/10 hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:scale-110 shadow-lg"
                >
                  <Instagram size={20} />
                </a>

                <a
                  href="https://facebook.com/suaPagina"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white transition-all bg-white/10 hover:bg-[#1877F2] hover:scale-110 shadow-lg"
                >
                  <Facebook size={20} />
                </a>

                <a
                  href="https://wa.me/5521972657221?text=Olá!%20Gostaria%20de%20tirar%20uma%20dúvida."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white transition-all bg-[#25D366] hover:bg-[#128C7E] hover:scale-110 shadow-lg"
                >
                  <FaWhatsapp size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-16 pt-8 text-center">
          <p className="text-white/30 text-xs font-medium uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Frigideira • Sabor Caseiro com Afeto
          </p>
        </div>
      </div>
    </footer>
  );
}
