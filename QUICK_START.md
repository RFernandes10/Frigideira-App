# 🚀 Guia Rápido - Frigideira

## ⚡ Setup Automático (Recomendado)

```bash
# Clone o projeto
git clone <seu-repositorio>
cd frigideira-project

# Execute o script de setup
./setup.sh

# Inicie o projeto com Docker
docker-compose up
```

Acesse: **http://localhost**

---

## 🛠️ Setup Manual

### 1. Backend

```bash
cd backend

# Copiar .env
cp .env.example .env

# Instalar dependências
npm install

# Rodar migrações
npx prisma migrate dev

# Popular banco com dados
npm run prisma:seed

# Ver os dados do banco
npx prisma studio

# Iniciar servidor
npm run dev
```

Backend rodando em: http://localhost:3333

### 2. Frontend

```bash
cd frontend

# Criar .env
echo "VITE_API_URL=http://localhost:3333/api" > .env

# Instalar dependências
npm install

# Iniciar aplicação
npm run dev
```

Frontend rodando em: http://localhost:5173

---

## 📱 Testando o Sistema

### 1. Acesse a Home

- http://localhost:5173 (ou http://localhost com Docker)
- Navegue pela interface
- Clique em "Ver cardápio de hoje"

### 2. Cardápio

- Você verá 2 pratos e 2 sobremesas (dados do seed)
- Escolha 1 prato + 1 sobremesa
- Clique em "Ir para o carrinho"

### 3. API Endpoints

Teste com curl ou Postman:

```bash
# Listar produtos
curl http://localhost:3333/api/products

# Cardápio de hoje
curl http://localhost:3333/api/menu/today

# Configurações
curl http://localhost:3333/api/settings

# Health check
curl http://localhost:3333/health
```

### 4. Prisma Studio

Visualize o banco de dados:

```bash
cd backend
npx prisma studio
```

Acesse: http://localhost:5555

---

## 🎨 Customização

### Alterar Cores da Marca

Edite `frontend/tailwind.config.js`:

```js
colors: {
  primary: {
    DEFAULT: '#FF6B35', // Laranja
    dark: '#E63946',     // Vermelho
  },
  secondary: {
    DEFAULT: '#2D6A4F',  // Verde
    light: '#F7F3E9',    // Bege
  },
}
```

### Alterar Informações da Frigideira

Edite `backend/.env`:

```env
PIX_KEY=seu_email@example.com
PIX_NAME=Frigideira - Seu Nome
```

Edite `frontend/src/components/Footer.tsx` para alterar:

- Telefone
- Email
- Endereço
- Redes sociais

---

## 📊 Gerenciar Cardápio

### Via Prisma Studio

1. Abra: `npx prisma studio`
2. Vá em `DailyMenu`
3. Crie novo registro com:
   - date: Data de hoje
   - dish1Id/dish2Id: IDs dos pratos (copie da tabela Product)
   - dessert1Id/dessert2Id: IDs das sobremesas
   - isActive: true

### Via API

```bash
# Criar cardápio
curl -X POST http://localhost:3333/api/menu \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-02-01T00:00:00.000Z",
    "dish1Id": "uuid-do-prato-1",
    "dish2Id": "uuid-do-prato-2",
    "dessert1Id": "uuid-da-sobremesa-1",
    "dessert2Id": "uuid-da-sobremesa-2",
    "maxOrders": 30
  }'
```

---

## 🐛 Resolução de Problemas

### Erro: "Port 3333 already in use"

```bash
# Encontrar processo usando a porta
lsof -ti:3333

# Matar processo
kill -9 <PID>
```

### Erro de conexão com banco

```bash
# Parar containers
docker-compose down

# Limpar volumes
docker-compose down -v

# Reiniciar
docker-compose up
```

### Reset completo do banco

```bash
cd backend
npx prisma migrate reset
npm run prisma:seed
```

---

## 📚 Comandos Úteis

```bash
# Ver logs do Docker
docker-compose logs -f

# Parar containers
docker-compose down

# Rebuild containers
docker-compose up --build

# Executar apenas banco
docker-compose up postgres

# Testes
cd backend && npm test
cd frontend && npm test
```

---

## 🎯 Próximos Passos

1. ✅ Testar fluxo completo
2. ✅ Adicionar seus próprios produtos
3. ✅ Customizar textos e imagens
4. ⬜ Implementar página de checkout
5. ⬜ Integrar pagamento Pix real
6. ⬜ Adicionar painel administrativo
7. ⬜ Deploy em produção

---

**Dúvidas?** Consulte o README.md principal!

**Bom desenvolvimento! 🚀🍽️**
