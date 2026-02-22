# 🏗️ ARQUITETURA DO PROJETO FRIGIDEIRA

## 📐 Visão Geral

O Frigideira é um sistema completo de e-commerce para vendas de quentinhas, desenvolvido com arquitetura moderna e escalável.

```
┌─────────────────────────────────────────────────────────────┐
│                       USUÁRIO FINAL                         │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────▼──────────┐
         │    NAVEGADOR WEB     │
         │   (React + TS)       │
         └───────────┬──────────┘
                     │
         ┌───────────▼──────────┐
         │    NGINX (Proxy)     │
         └───────────┬──────────┘
                     │
         ┌───────────▼──────────┐
         │   BACKEND API        │
         │ (Node.js + Express)  │
         └───────────┬──────────┘
                     │
         ┌───────────▼──────────┐
         │   PRISMA ORM         │
         └───────────┬──────────┘
                     │
         ┌───────────▼──────────┐
         │   POSTGRESQL         │
         └──────────────────────┘
```

---

## 🎨 FRONTEND (React + TypeScript)

### Tecnologias
- **React 18** - Framework UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS** - Estilização utility-first
- **Context API** - Gerenciamento de estado
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP
- **Zod** - Validação de schemas

### Estrutura de Pastas

```
frontend/src/
├── components/          # Componentes reutilizáveis
│   ├── Navbar.tsx
│   └── Footer.tsx
├── contexts/           # Context API
│   └── CartContext.tsx # Gerenciamento do carrinho
├── pages/              # Páginas da aplicação
│   ├── Home.tsx
│   ├── Cardapio.tsx
│   ├── Carrinho.tsx (a implementar)
│   └── Checkout.tsx (a implementar)
├── services/           # Serviços externos
│   └── api.ts         # Cliente da API
├── types/              # Tipos TypeScript
│   └── index.ts
├── App.tsx             # Componente raiz
└── main.tsx            # Entry point
```

### Fluxo de Dados (Context API)

```
┌──────────────────────────────────────┐
│        CartProvider (Context)        │
│                                      │
│  State:                              │
│  - items: CartItem[]                 │
│  - total: number                     │
│  - itemsCount: number                │
│                                      │
│  Actions:                            │
│  - addItem()                         │
│  - removeItem()                      │
│  - updateQuantity()                  │
│  - clearCart()                       │
└──────────────────────────────────────┘
         │
         ├─────> Navbar (exibe contador)
         ├─────> Cardapio (adiciona itens)
         ├─────> Carrinho (lista itens)
         └─────> Checkout (finaliza)
```

### Design System

**Cores:**
- Primary: `#FF6B35` (Laranja) - CTAs, botões, destaques
- Primary Dark: `#E63946` (Vermelho) - Hover, ações urgentes
- Secondary: `#2D6A4F` (Verde) - Confirmações, sucesso
- Secondary Light: `#F7F3E9` (Bege) - Backgrounds
- Accent Brown: `#3D2817` (Marrom) - Textos, títulos

**Tipografia:**
- Display: Archivo Black (títulos, destaque)
- Body: DM Sans (textos, parágrafos)

**Componentes Base:**
- Botões: Rounded, shadow, hover effects
- Cards: Border-radius 12px, sombra suave
- Inputs: Border 2px, focus states
- Modais: Backdrop blur, animação fade

---

## ⚙️ BACKEND (Node.js + Express + Prisma)

### Tecnologias
- **Node.js 20** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **Prisma** - ORM moderno
- **PostgreSQL** - Banco relacional
- **Zod** - Validação de dados
- **date-fns** - Manipulação de datas

### Estrutura de Pastas

```
backend/src/
├── routes/              # Rotas da API
│   ├── products.routes.ts
│   ├── orders.routes.ts
│   ├── menu.routes.ts
│   └── settings.routes.ts
├── middleware/          # Middlewares
│   └── errorHandler.ts
├── lib/                 # Bibliotecas
│   └── prisma.ts       # Prisma Client
└── server.ts            # Servidor Express
```

### Arquitetura de Rotas

```
API (http://localhost:3333/api)
│
├── /products           # Gerenciamento de produtos
│   ├── GET    /                # Lista todos
│   ├── GET    /:id             # Busca por ID
│   ├── POST   /                # Criar novo
│   ├── PUT    /:id             # Atualizar
│   ├── PATCH  /:id/toggle      # Ativar/desativar
│   └── DELETE /:id             # Deletar
│
├── /menu               # Cardápio diário
│   ├── GET    /today           # Cardápio de hoje
│   ├── GET    /:date           # Cardápio por data
│   ├── POST   /                # Criar cardápio
│   ├── PATCH  /:id/toggle      # Ativar/desativar
│   └── DELETE /:id             # Deletar
│
├── /orders             # Pedidos
│   ├── GET    /                # Lista todos
│   ├── GET    /:id             # Busca por ID
│   ├── POST   /                # Criar pedido
│   ├── PATCH  /:id/status      # Atualizar status
│   ├── PATCH  /:id/payment     # Confirmar pagamento
│   └── GET    /stats/today     # Estatísticas
│
└── /settings           # Configurações
    ├── GET    /                # Buscar config
    ├── PUT    /                # Atualizar config
    └── PATCH  /toggle-orders   # Pausar/retomar
```

### Fluxo de Requisição

```
1. Request chega no Express
         ↓
2. Middleware de CORS
         ↓
3. Middleware de JSON parsing
         ↓
4. Router específico (ex: /api/products)
         ↓
5. Validação com Zod
         ↓
6. Controller/Handler
         ↓
7. Prisma ORM query
         ↓
8. PostgreSQL
         ↓
9. Response (JSON)
         ↓
10. Error Handler (se houver erro)
```

---

## 🗄️ BANCO DE DADOS (PostgreSQL + Prisma)

### Schema Principal

```prisma
Product          # Produtos (pratos e sobremesas)
├── id: String
├── name: String
├── description: String
├── price: Float
├── category: "prato" | "sobremesa"
├── stock: Int
└── isActive: Boolean

DailyMenu        # Cardápio do dia
├── id: String
├── date: DateTime
├── dish1Id: String
├── dish2Id: String
├── dessert1Id: String
├── dessert2Id: String
├── maxOrders: Int
└── isActive: Boolean

Customer         # Clientes
├── id: String
├── name: String
├── phone: String (unique)
└── email: String?

Order            # Pedidos
├── id: String
├── orderNumber: Int (auto)
├── customerId: String
├── deliveryType: "entrega" | "retirada"
├── deliveryAddress: String?
├── deliveryFee: Float
├── subtotal: Float
├── total: Float
├── paymentStatus: "pendente" | "confirmado"
├── status: "novo" | "preparando" | "pronto" | "entregue"
└── items: OrderItem[]

OrderItem        # Itens do pedido
├── id: String
├── orderId: String
├── productId: String
├── quantity: Int
├── price: Float
└── type: "prato" | "sobremesa"

Settings         # Configurações do sistema
├── deliveryFee: Float
├── pixKey: String
├── maxDailyOrders: Int
└── isAcceptingOrders: Boolean
```

### Relacionamentos

```
Customer ─── 1:N ──> Order
Order ────── 1:N ──> OrderItem
Product ──── 1:N ──> OrderItem
```

---

## 🐳 DOCKER & DEPLOY

### Containers

```yaml
services:
  postgres:          # Banco de dados
    - Port: 5432
    - Volume: postgres_data
  
  backend:           # API Node.js
    - Port: 3333
    - Depends: postgres
  
  frontend:          # React + Nginx
    - Port: 80
    - Depends: backend
```

### Fluxo de Deploy

```
1. Build das imagens Docker
         ↓
2. Subir PostgreSQL
         ↓
3. Executar migrações Prisma
         ↓
4. Subir backend
         ↓
5. Build do frontend
         ↓
6. Nginx serve frontend + proxy API
```

---

## 🔒 SEGURANÇA

### Implementações de Segurança

1. **Validação de Dados**
   - Zod para validação de schemas
   - TypeScript para tipagem estrita

2. **Tratamento de Erros**
   - Middleware centralizado
   - Logs estruturados
   - Mensagens seguras ao cliente

3. **CORS**
   - Configurado para domínios específicos
   - Credentials permitidos

4. **SQL Injection**
   - Prisma ORM previne automaticamente
   - Queries parametrizadas

5. **Rate Limiting** (a implementar)
   - Limitar requisições por IP
   - Proteger endpoints críticos

---

## 📊 PERFORMANCE

### Otimizações Frontend

- **Code Splitting**: React Router lazy loading
- **Tree Shaking**: Vite remove código não usado
- **Minificação**: Build otimizado
- **Caching**: Service Worker (a implementar)
- **Imagens**: Lazy loading, formato WebP

### Otimizações Backend

- **Prisma Connection Pool**: Reutilização de conexões
- **Índices no DB**: Em campos de busca frequente
- **Pagination**: Limitar resultados
- **Caching Redis** (a implementar)

### Otimizações Nginx

- **Gzip Compression**: Reduz tamanho de assets
- **Static Caching**: Headers de cache
- **HTTP/2**: Multiplexação de requests

---

## 🧪 TESTES

### Estratégia de Testes

```
Frontend:
├── Unit Tests (Jest)
│   ├── Componentes individuais
│   ├── Hooks customizados
│   └── Funções utilitárias
└── Integration Tests (React Testing Library)
    ├── Fluxos de usuário
    └── Interações entre componentes

Backend:
├── Unit Tests (Jest)
│   ├── Middlewares
│   ├── Validações
│   └── Funções helper
├── Integration Tests
│   ├── Rotas da API
│   └── Integração com DB (em memória)
└── E2E Tests (a implementar)
    └── Fluxos completos
```

---

## 📈 ESCALABILIDADE

### Horizontal Scaling

```
Load Balancer
      │
      ├─── Frontend Instance 1
      ├─── Frontend Instance 2
      └─── Frontend Instance N

Load Balancer
      │
      ├─── Backend Instance 1
      ├─── Backend Instance 2
      └─── Backend Instance N
```

### Database Scaling

- **Read Replicas**: Para queries de leitura
- **Connection Pooling**: Prisma + PgBouncer
- **Índices**: Otimização de queries
- **Particionamento**: Por data (orders, menus)

---

## 🔄 CI/CD (Sugestão)

```
1. Git Push
      ↓
2. GitHub Actions
      ├─ Run Linter
      ├─ Run Tests
      ├─ Build Docker Images
      └─ Push to Registry
      ↓
3. Deploy to Server
      ├─ Pull Images
      ├─ Run Migrations
      └─ Restart Containers
      ↓
4. Health Checks
      ↓
5. Rollback (se necessário)
```

---

## 📚 DOCUMENTAÇÃO TÉCNICA

### APIs Documentadas

Swagger/OpenAPI (a implementar):
- http://localhost:3333/api-docs

### Prisma Studio

Interface visual do banco:
- http://localhost:5555

---

## 🎯 PRÓXIMAS MELHORIAS

### Fase 1 (MVP Completo)
- [ ] Página de checkout completa
- [ ] Integração Pix real (API Mercado Pago/PagSeguro)
- [ ] Confirmação de pagamento automática
- [ ] Notificações por email (SendGrid/AWS SES)

### Fase 2 (Admin)
- [ ] Painel administrativo
- [ ] Dashboard com métricas
- [ ] Gerenciamento de produtos
- [ ] Gerenciamento de pedidos em tempo real
- [ ] Relatórios financeiros

### Fase 3 (Recursos Avançados)
- [ ] Integração WhatsApp Business API
- [ ] Sistema de cupons de desconto
- [ ] Programa de fidelidade
- [ ] Agendamento de pedidos recorrentes
- [ ] Sistema de avaliações

### Fase 4 (Otimizações)
- [ ] PWA (Progressive Web App)
- [ ] Push Notifications
- [ ] Cache com Redis
- [ ] CDN para assets
- [ ] Monitoramento (Sentry, DataDog)

---

**Arquitetura projetada para crescer com o negócio! 🚀**
