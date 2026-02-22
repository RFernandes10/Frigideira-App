# 🍽️ Frigideira - Sistema de Pedidos de Quentinhas

Sistema completo de vendas online de quentinhas desenvolvido com **React + TypeScript** no frontend e **Node.js + Express + Prisma** no backend.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Vite** (build tool)
- **Tailwind CSS** (estilização)
- **React Router DOM** (rotas)
- **Context API** (gerenciamento de estado)
- **Axios** (requisições HTTP)
- **React Hot Toast** (notificações)
- **Lucide React** (ícones)
- **Jest** (testes)

### Backend
- **Node.js** com TypeScript
- **Express** (framework web)
- **Prisma** (ORM)
- **PostgreSQL** (banco de dados)
- **Zod** (validação)
- **date-fns** (manipulação de datas)
- **Jest** (testes)

### DevOps
- **Docker** & **Docker Compose**
- **Nginx** (reverse proxy e servir frontend)

---

## 📦 Estrutura do Projeto

```
frigideira-project/
├── frontend/               # Aplicação React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── contexts/      # Context API (Cart, etc)
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── services/      # Serviços de API
│   │   ├── types/         # Tipos TypeScript
│   │   └── App.tsx        # Componente principal
│   ├── Dockerfile
│   └── package.json
│
├── backend/               # API Node.js
│   ├── src/
│   │   ├── routes/       # Rotas da API
│   │   ├── middleware/   # Middlewares
│   │   ├── lib/          # Bibliotecas (Prisma client)
│   │   └── server.ts     # Servidor Express
│   ├── prisma/
│   │   └── schema.prisma # Schema do banco
│   ├── Dockerfile
│   └── package.json
│
└── docker-compose.yml     # Orquestração dos serviços
```

---

## 🛠️ Instalação e Execução

### Pré-requisitos

- **Node.js** 20+ instalado
- **Docker** e **Docker Compose** instalados
- **Git** instalado

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/frigideira-project.git
cd frigideira-project
```

### 2. Configure as variáveis de ambiente

#### Backend

```bash
cd backend
cp .env.example .env
```

Edite o arquivo `.env` com suas informações:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/frigideira?schema=public"
PORT=3333
NODE_ENV=development
JWT_SECRET=sua_chave_secreta_super_segura
PIX_KEY=seu_email@example.com
PIX_NAME=Frigideira - Seu Nome
```

#### Frontend

```bash
cd ../frontend
```

Crie um arquivo `.env`:

```env
VITE_API_URL=http://localhost:3333/api
```

### 3. Executar com Docker (Recomendado)

Na raiz do projeto:

```bash
docker-compose up --build
```

Isso irá:
- Subir o PostgreSQL na porta 5432
- Subir o backend na porta 3333
- Subir o frontend na porta 80

**Acesse:** http://localhost

### 4. Executar manualmente (Desenvolvimento)

#### Backend

```bash
cd backend

# Instalar dependências
npm install

# Rodar migrações do Prisma
npx prisma migrate dev

# Gerar Prisma Client
npx prisma generate

# Ver os dados do banco
npx prisma studio


# Iniciar servidor de desenvolvimento
npm run dev
```

Backend rodando em: http://localhost:3333

#### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Frontend rodando em: http://localhost:5173

---

## 📚 Endpoints da API

### Produtos

- `GET /api/products` - Listar produtos
- `GET /api/products?category=prato` - Listar apenas pratos
- `GET /api/products/:id` - Buscar produto específico
- `POST /api/products` - Criar produto
- `PUT /api/products/:id` - Atualizar produto
- `PATCH /api/products/:id/toggle` - Ativar/desativar produto
- `DELETE /api/products/:id` - Deletar produto

### Cardápio

- `GET /api/menu/today` - Cardápio do dia
- `GET /api/menu/:date` - Cardápio por data
- `POST /api/menu` - Criar cardápio
- `PATCH /api/menu/:id/toggle` - Ativar/desativar cardápio
- `DELETE /api/menu/:id` - Deletar cardápio

### Pedidos

- `GET /api/orders` - Listar pedidos
- `GET /api/orders?status=novo` - Filtrar por status
- `GET /api/orders/:id` - Buscar pedido específico
- `POST /api/orders` - Criar pedido
- `PATCH /api/orders/:id/status` - Atualizar status
- `PATCH /api/orders/:id/payment` - Confirmar pagamento
- `GET /api/orders/stats/today` - Estatísticas do dia

### Configurações

- `GET /api/settings` - Buscar configurações
- `PUT /api/settings` - Atualizar configurações
- `PATCH /api/settings/toggle-orders` - Pausar/retomar pedidos

---

## 🧪 Testes

### Backend

```bash
cd backend
npm test
npm run test:watch
```

### Frontend

```bash
cd frontend
npm test
npm run test:watch
```

---

## 📊 Prisma Studio

Para visualizar e editar dados do banco visualmente:

```bash
cd backend
npx prisma studio
```

Acesse: http://localhost:5555

---

## 🔄 Migrações do Banco

Criar nova migração:

```bash
cd backend
npx prisma migrate dev --name nome_da_migracao
```

Aplicar migrações em produção:

```bash
npx prisma migrate deploy
```

Resetar banco (CUIDADO - apaga todos os dados):

```bash
npx prisma migrate reset
```

---

## 🚢 Deploy

### Deploy com Docker

```bash
# Build das imagens
docker-compose build

# Subir em produção
docker-compose up -d
```

### Deploy Manual

1. **Backend:**
   - Configure variáveis de ambiente
   - Execute `npm run build`
   - Execute `npm start`

2. **Frontend:**
   - Configure variáveis de ambiente
   - Execute `npm run build`
   - Sirva a pasta `dist` com Nginx ou similar

---

## 📝 Funcionalidades Implementadas

- ✅ Visualização de cardápio diário
- ✅ Carrinho de compras (Context API)
- ✅ Sistema de pedidos
- ✅ Cálculo automático de entrega
- ✅ Gerenciamento de estoque
- ✅ Controle de limites diários
- ✅ Validação com Zod
- ✅ Tratamento de erros
- ✅ Interface responsiva
- ✅ Notificações toast
- ✅ Design profissional

## 🎯 Próximos Passos

- [ ] Página de carrinho completa
- [ ] Página de checkout
- [ ] Integração com pagamento Pix
- [ ] Painel administrativo
- [ ] Autenticação de admin
- [ ] Sistema de notificações
- [ ] Integração com WhatsApp
- [ ] Relatórios e dashboard
- [ ] Sistema de avaliações
- [ ] Upload de imagens

---

## 📄 Licença

MIT License - Sinta-se livre para usar este projeto!

---

## 👨‍💻 Autor

Desenvolvido com ❤️ para o projeto Frigideira

---

## 🆘 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Entre em contato via email

**Bom apetite! 🍽️🔥**
