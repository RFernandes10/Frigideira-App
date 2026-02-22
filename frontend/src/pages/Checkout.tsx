import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { ordersApi } from '@/services/api';
import { ArrowLeft, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, total, clearCart } = useCart();

  const deliveryType = location.state?.deliveryType || 'entrega';
  const deliveryFee = deliveryType === 'entrega' ? 2.0 : 0;
  const finalTotal = total + deliveryFee;

  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Dados pessoais
    name: '',
    phone: '',
    email: '',

    // Endereço (se entrega)
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    reference: '',

    // Observações
    observations: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Efeito para buscar o CEP
  useEffect(() => {
    const cep = formData.cep.replace(/\D/g, '');

    if (cep.length !== 8) {
      return;
    }

    const fetchCEP = async () => {
      setCepLoading(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
          toast.error('CEP não encontrado. Por favor, verifique.');
          setErrors(prev => ({ ...prev, cep: 'CEP não encontrado' }));
        } else {
          setFormData(prev => ({
            ...prev,
            street: data.logradouro,
            neighborhood: data.bairro,
          }));
          // Limpa erros de rua e bairro se encontrados
          setErrors(prev => ({ ...prev, street: '', neighborhood: '' }));
          document.getElementById('number')?.focus(); // Foca no campo de número
        }
      } catch (error) {
        toast.error('Não foi possível buscar o CEP. Tente novamente.');
      } finally {
        setCepLoading(false);
      }
    };

    fetchCEP();
  }, [formData.cep]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Limpar erro ao digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    setFormData(prev => ({ ...prev, cep: formatted }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Validações obrigatórias
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Telefone inválido';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validações de endereço (se entrega)
    if (deliveryType === 'entrega') {
      if (!formData.cep.trim()) {
        newErrors.cep = 'CEP é obrigatório';
      }
      if (!formData.street.trim()) {
        newErrors.street = 'Rua é obrigatória';
      }
      if (!formData.number.trim()) {
        newErrors.number = 'Número é obrigatório';
      }
      if (!formData.neighborhood.trim()) {
        newErrors.neighborhood = 'Bairro é obrigatório';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (items.length === 0) {
      toast.error('Seu carrinho está vazio');
      navigate('/cardapio');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customer: {
          name: formData.name,
          phone: formData.phone.replace(/\D/g, ''),
          email: formData.email || undefined,
        },
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          type: item.type,
        })),
        deliveryType,
        deliveryAddress: deliveryType === 'entrega'
          ? `${formData.street}, ${formData.number}${formData.complement ? ' - ' + formData.complement : ''} - ${formData.neighborhood}${formData.reference ? ' (Ref: ' + formData.reference + ')' : ''}`
          : undefined,
        observations: formData.observations || undefined,
      };

      const order = await ordersApi.create(orderData);

      toast.success('Pedido criado com sucesso!');
      clearCart();

      // Navegar para página de pagamento
      navigate('/pagamento', { state: { order } });
    } catch (error: any) {
      console.error('Erro ao criar pedido:', error);
      toast.error(error.message || 'Erro ao criar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cardapio');
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary-light py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/carrinho')}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              <span>Voltar ao carrinho</span>
            </button>
            <h1 className="font-display text-4xl text-accent-brown mb-2">
              Finalizando seu pedido
            </h1>
            <p className="text-gray-600">
              Falta pouco! Preencha seus dados para {deliveryType === 'entrega' ? 'entrega' : 'retirada'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dados Pessoais */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="font-display text-2xl text-accent-brown mb-6">
                Seus dados
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.name ? 'border-red-500' : 'border-gray-200'
                      }`}
                    placeholder="João Silva"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.phone ? 'border-red-500' : 'border-gray-200'
                        }`}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Enviaremos atualizações do pedido
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail (opcional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.email ? 'border-red-500' : 'border-gray-200'
                        }`}
                      placeholder="joao@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Endereço de Entrega (se aplicável) */}
            {deliveryType === 'entrega' && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="font-display text-2xl text-accent-brown mb-6">
                  Endereço de entrega
                </h2>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CEP <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="cep"
                        value={formData.cep}
                        onChange={handleCEPChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.cep ? 'border-red-500' : 'border-gray-200'
                          }`}
                        placeholder="00000-000"
                        maxLength={9}
                      />
                      {cepLoading && <Loader size={20} className="animate-spin text-primary absolute right-3 top-10" />}
                      {errors.cep && (
                        <p className="text-red-500 text-sm mt-1">{errors.cep}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rua <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.street ? 'border-red-500' : 'border-gray-200'
                        }`}
                      placeholder="Rua das Flores"
                    />
                    {errors.street && (
                      <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="number"
                        name="number"
                        value={formData.number}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.number ? 'border-red-500' : 'border-gray-200'
                          }`}
                        placeholder="123"
                      />
                      {errors.number && (
                        <p className="text-red-500 text-sm mt-1">{errors.number}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Complemento
                      </label>
                      <input
                        type="text"
                        name="complement"
                        value={formData.complement}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        placeholder="Apto 101, Bloco B"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bairro <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.neighborhood ? 'border-red-500' : 'border-gray-200'
                        }`}
                      placeholder="Centro"
                    />
                    {errors.neighborhood && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.neighborhood}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ponto de referência
                    </label>
                    <input
                      type="text"
                      name="reference"
                      value={formData.reference}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="Próximo ao mercado São João"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Local de Retirada (se aplicável) */}
            {deliveryType === 'retirada' && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="font-display text-2xl text-accent-brown mb-4">
                  ✓ Você escolheu retirar no local
                </h2>
                <div className="bg-secondary-light rounded-lg p-4 space-y-3">
                  <p className="text-accent-brown font-medium">
                    📍 Endereço para retirada:
                  </p>
                  <p className="text-gray-700">
                    Rua Recife, 873 - Realengo<br />
                    Rio de Janeiro/RJ
                  </p>
                  <p className="text-gray-700">
                    ⛪ Ponto de referência: Proximo Igreja Catolica Nossa Senhora das Graças
                  </p>
                  <p className="text-gray-700">
                    📞 Telefone para contato: (21) 97265-7221
                  </p>
                  <p className="text-gray-700">
                    🗺️ <a href="https://www.google.com/maps?q=Rua+Recife,+873+Realengo+Rio+de+Janeiro" target="_blank" className="text-accent-brown underline">
                      Abrir no Google Maps
                    </a>
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Horário de retirada:</strong> 11h às 14h
                  </p>
                </div>

              </div>
            )}

            {/* Observações */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="font-display text-2xl text-accent-brown mb-4">
                Algum pedido especial?
              </h2>
              <textarea
                name="observations"
                value={formData.observations}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                placeholder="Ex: Sem cebola, pouco sal, etc."
              />
            </div>

            {/* Resumo e Botão */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="font-display text-2xl text-accent-brown mb-4">
                Resumo do pedido
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Itens:</p>
                    {items.map(item => (
                      <p key={item.product.id} className="text-sm">
                        {item.quantity}x {item.product.name}
                      </p>
                    ))}
                  </div>
                  <p className="text-gray-700">R$ {total.toFixed(2)}</p>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>
                    {deliveryType === 'entrega' ? '🚚 Entrega' : '🏠 Retirada'}
                  </span>
                  <span>{deliveryType === 'entrega' ? 'R$ 2,00' : 'Grátis'}</span>
                </div>

                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-display text-xl text-accent-brown">
                    Total
                  </span>
                  <span className="font-display text-3xl text-primary">
                    R$ {finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Processando...
                  </>
                ) : (
                  'Ir para pagamento →'
                )}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Ao finalizar, você será direcionado para o pagamento via Pix
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
