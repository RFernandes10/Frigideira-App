import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/contexts/CartContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Components
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { Spinner } from '@/components/Spinner'; // Importar o novo componente Spinner

// Lazy-loaded Pages
const Home = lazy(() => import('@/pages/Home').then(module => ({ default: module.Home })));
const Cardapio = lazy(() => import('@/pages/Cardapio').then(module => ({ default: module.Cardapio })));
const Carrinho = lazy(() => import('@/pages/Carrinho').then(module => ({ default: module.Carrinho })));
const Checkout = lazy(() => import('@/pages/Checkout').then(module => ({ default: module.Checkout })));
const Pagamento = lazy(() => import('@/pages/Pagamento').then(module => ({ default: module.Pagamento })));

// Funções de Prefetch para navegação instantânea
const prefetchPages = {
  cardapio: () => import('@/pages/Cardapio'),
  carrinho: () => import('@/pages/Carrinho'),
  checkout: () => import('@/pages/Checkout'),
  home: () => import('@/pages/Home'),
};

// Tornar o prefetch disponível globalmente via window para ser usado em botões
(window as any).prefetchPage = (page: keyof typeof prefetchPages) => {
  if (prefetchPages[page]) {
    prefetchPages[page]();
  }
};

function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <CartProvider>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<Spinner />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/cardapio" element={<Cardapio />} />
                  <Route path="/carrinho" element={<Carrinho />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/pagamento" element={<Pagamento />} />
                  {/* As rotas administrativas protegidas e a rota de login admin foram removidas. */}
                  {/* Adicionar mais rotas conforme necessário */}
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
          <ScrollToTopButton />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#3D2817',
                color: '#fff',
                fontFamily: 'DM Sans, sans-serif',
              },
              success: {
                iconTheme: {
                  primary: '#2D6A4F',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#E63946',
                  secondary: '#fff',
                },
              },
            }}
          />
        </ThemeProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
