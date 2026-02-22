import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Sun, Moon } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { itemsCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollToSection = (sectionId: string) => {
    setIsOpen(false); // Close mobile menu if open
    if (location.pathname === '/') {
      // If already on homepage, scroll directly
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If on another page, navigate to home and pass state to scroll
      navigate('/', { state: { scrollToId: sectionId } });
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40 dark:bg-gray-800 dark:text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform group relative">
              <img
                src="/home.svg"
                alt="Quentinha"
                className="
      w-24 h-24 object-contain rounded-full
      transition-all duration-300
      dark:invert dark:brightness-0
    "
              />
            </div>



            <span className="font-display text-2xl text-accent-brown dark:text-white">FRIGIDEIRA</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              onMouseEnter={() => (window as any).prefetchPage?.('home')}
              className="text-gray-700 hover:text-primary font-medium transition-colors dark:text-gray-300 dark:hover:text-primary"
            >
              Início
            </Link>
            <Link
              to="/cardapio"
              onMouseEnter={() => (window as any).prefetchPage?.('cardapio')}
              className="text-gray-700 hover:text-primary font-medium transition-colors dark:text-gray-300 dark:hover:text-primary"
            >
              Cardápio
            </Link>
            <button
              onClick={() => handleScrollToSection('como-funciona')}
              className="text-gray-700 hover:text-primary font-medium transition-colors dark:text-gray-300 dark:hover:text-primary"
            >
              Como Funciona
            </button>
            <a
              href="https://wa.me/5521972657221?text=Olá!%20Gostaria%20de%20tirar%20uma%20dúvida."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Fale conosco pelo WhatsApp"
              title="Fale conosco pelo WhatsApp"
              className="text-green-500 hover:text-green-700 font-medium transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaWhatsapp size={20} />
            </a>

            <button
              onClick={toggleTheme}
              className="text-gray-700 hover:text-primary font-medium transition-colors p-2 rounded-full hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label="Alternar tema"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button
              onClick={() => navigate('/carrinho')}
              onMouseEnter={() => (window as any).prefetchPage?.('carrinho')}
              className="relative bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
            >
              <ShoppingCart size={20} />
              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-dark text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                  {itemsCount}
                </span>
              )}
              Carrinho
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-accent-brown dark:text-gray-300"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t animate-fade-in dark:border-gray-700">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-primary font-medium py-2 dark:text-gray-300 dark:hover:text-primary"
              >
                Início
              </Link>
              <Link
                to="/cardapio"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-primary font-medium py-2 dark:text-gray-300 dark:hover:text-primary"
              >
                Cardápio
              </Link>
              <button
                onClick={() => handleScrollToSection('como-funciona')}
                className="text-gray-700 hover:text-primary font-medium py-2 text-left w-full dark:text-gray-300 dark:hover:text-primary"
              >
                Como Funciona
              </button>
              <a
                href="https://wa.me/5521972657221?text=Olá!%20Gostaria%20de%20tirar%20uma%20dúvida."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Fale conosco pelo WhatsApp"
                title="Fale conosco pelo WhatsApp"
                onClick={() => setIsOpen(false)}
                className="text-green-500 hover:text-green-700 font-medium py-2 text-left w-full flex items-center gap-2 dark:text-green-400 dark:hover:text-green-300"
              >
                <FaWhatsapp size={20} />
                WhatsApp
              </a>

              <button
                onClick={toggleTheme}
                className="text-gray-700 hover:text-primary font-medium py-2 text-left w-full flex items-center gap-2 dark:text-gray-300 dark:hover:text-primary"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                Alternar Tema
              </button>

              <button
                onClick={() => {
                  navigate('/carrinho');
                  setIsOpen(false);
                }}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingCart size={20} />
                Carrinho {itemsCount > 0 && `(${itemsCount})`}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
