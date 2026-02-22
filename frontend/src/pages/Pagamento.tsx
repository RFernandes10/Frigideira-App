import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Clipboard, ArrowLeft, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { settingsApi } from '@/services/api'; // Importar settingsApi
import { Settings } from '@/types'; // Importar tipo Settings
import { generatePixPayload } from '@/utils/pix';


export function Pagamento() {
  const navigate = useNavigate();
  const location = useLocation();
  const [payment, setPayment] = useState<{ qrCodeUrl: string; pixCode: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Settings | null>(null); // Novo estado para settings
  const [settingsError, setSettingsError] = useState(''); // Novo estado para erro de settings

  const order = location.state?.order;

  useEffect(() => {
    if (!order) {
      toast.error('Nenhum pedido encontrado. Redirecionando...');
      navigate('/cardapio');
      return;
    }

    const fetchSettingsAndGeneratePix = async () => {
      try {
        setLoading(true); // Começa a carregar
        const fetchedSettings = await settingsApi.get();
        setSettings(fetchedSettings);

        // Atraso simulado para gerar o Pix (mantido do código original)
        setTimeout(() => {
          const finalTotal = order.total;
          const txid = `PEDIDO${order.id.substring(0, 8).toUpperCase()}`;

          // Usar os valores das configurações do backend
          const pixKey = fetchedSettings.pixKey;
          const merchantName = fetchedSettings.pixName;
          const merchantCity = fetchedSettings.pixCity || 'RIO DE JANEIRO';

          const pixCode = generatePixPayload(pixKey, merchantName, merchantCity, txid, finalTotal);
          
          const pixData = {
            qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCode)}`,
            pixCode: pixCode,
          };

          setPayment(pixData);
          setLoading(false); // Termina de carregar
        }, 1500);

      } catch (err) {
        setSettingsError('Erro ao carregar configurações Pix.');
        console.error(err);
        setLoading(false); // Termina de carregar com erro
      }
    };
    
    fetchSettingsAndGeneratePix();

  }, [order, navigate]);

  const copyToClipboard = () => {
    if (payment?.pixCode) {
      navigator.clipboard.writeText(payment.pixCode);
      toast.success('Código Pix copiado para a área de transferência!');
    }
  };
  
  const finalTotal = order?.total;

  return (
    <div className="min-h-screen bg-secondary-light py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              <span>Voltar para o Início</span>
            </button>
             <div className="flex items-center justify-center text-center mb-4">
              <CheckCircle className="text-secondary mr-3" size={40} />
              <h1 className="font-display text-4xl text-accent-brown">
                Pedido recebido!
              </h1>
            </div>
            <p className="text-gray-600 text-center">
              Agora so falta o pagamento. Agradecemos a preferência!
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center bg-white glass-card p-16 shadow-soft">
              <Loader className="animate-spin text-primary mb-6" size={56} />
              <p className="font-display text-2xl text-accent-brown">Preparando seu pedido...</p>
              <p className="text-gray-500 text-sm mt-2">Gerando seu código Pix exclusivo</p>
            </div>
          ) : settingsError ? (
            <div className="glass-card p-12 shadow-soft text-center">
               <div className="bg-red-50/50 border-l-4 border-red-400 p-6 mb-8 rounded-r-xl">
                <p className="text-red-700 font-medium">{settingsError}</p>
                <p className="text-sm text-red-600 mt-2">Ocorreu um erro ao carregar as informações do Pix. Por favor, tente novamente.</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Tentar Novamente
              </button>
            </div>
          ) : (
            <div className="glass-card p-8 sm:p-12 shadow-card text-center border-t-8 border-primary">
              <h2 className="font-display text-3xl text-accent-brown mb-3">
                Finalize com Pix
              </h2>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                Para começar a preparar sua refeição, por favor realize o pagamento abaixo:
              </p>

              <div className="flex justify-center mb-8 relative">
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl scale-75 -z-10"></div>
                <img 
                  src={payment?.qrCodeUrl} 
                  alt="QR Code para pagamento Pix"
                  className="w-72 h-72 rounded-3xl border-8 border-white shadow-soft transition-transform hover:scale-105 duration-500"
                />
              </div>
              
              <div className="relative mb-10 max-w-md mx-auto">
                <div className="bg-secondary-light/50 border-2 border-dashed border-gray-200 p-5 rounded-2xl break-all text-xs font-mono text-gray-600">
                  {payment?.pixCode}
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="absolute -top-3 -right-3 bg-accent-brown text-white p-3 rounded-2xl hover:bg-primary transition-all shadow-lg hover:shadow-primary/30"
                  aria-label="Copiar código Pix para área de transferência"
                >
                  <Clipboard size={20} />
                </button>
              </div>

              {/* Botão de Confirmação via WhatsApp */}
              <button
                onClick={() => {
                  const message = encodeURIComponent(`Olá! Acabei de realizar o pagamento do meu pedido #${order.orderNumber || order.id.substring(0, 8)} no valor de R$ ${finalTotal.toFixed(2)}. Segue o comprovante:`);
                  const whatsappUrl = `https://wa.me/${(settings as any)?.whatsapp || '5521972657221'}?text=${message}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-5 px-8 rounded-2xl transition-all transform hover:scale-[1.02] shadow-xl hover:shadow-[#25D366]/30 flex items-center justify-center gap-3 mb-10 text-lg"
              >
                <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Confirmar Pagamento
              </button>

              <div className="bg-secondary-light/30 border-2 border-white/50 p-8 rounded-3xl space-y-4 shadow-inner">
                <div className="flex justify-between items-center text-gray-600 border-b border-gray-100 pb-3">
                  <span className="font-medium">Cliente</span>
                  <span className="font-bold text-accent-brown">{order.customer.name}</span>
                </div>
                 <div className="flex justify-between items-center text-gray-600 border-b border-gray-100 pb-3">
                  <span className="font-medium">Tipo de Pedido</span>
                  <span className="font-bold text-accent-brown">{order.deliveryType === 'entrega' ? '🚚 Entrega' : '🏪 Retirada'}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-display text-xl text-accent-brown">Total Pago</span>
                  <span className="font-display text-3xl text-primary">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finalTotal)}
                  </span>
                </div>
              </div>
              
               <div className="mt-10 bg-primary/10 p-5 rounded-2xl text-sm text-primary-dark font-medium border border-primary/20">
                <p>💡 Após o envio do comprovante, seu pedido entrará na fila de preparo!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
