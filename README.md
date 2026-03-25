# Budgetly

Aplicação fullstack de controle financeiro pessoal. Permite gerenciar contas bancárias, categorias de transações e registrar receitas e despesas com visualizações e relatórios financeiros.

## Estrutura do repositório

```
budgetly-app/
├── budgetly-app-backend/   # API REST — Fastify + Prisma + PostgreSQL
└── budgetly-app-frontend/  # Interface web — Next.js 15 + React 19
```

## Funcionalidades

- Autenticação com JWT (registro e login)
- Gerenciamento de contas (Corrente, Poupança, Crédito, Dinheiro)
- Gerenciamento de categorias por tipo (receita / despesa)
- Registro, edição e exclusão de transações
- Filtros por conta, categoria, tipo, período e valor
- Dashboard com gráficos de evolução mensal e gastos por categoria
- Resumo financeiro: saldo total, receitas e despesas do mês

## Tecnologias

### Backend
- [Fastify v5](https://fastify.dev/) — framework HTTP
- [Prisma ORM](https://www.prisma.io/) — acesso ao banco de dados
- [PostgreSQL](https://www.postgresql.org/) — banco de dados relacional
- [Zod](https://zod.dev/) — validação de esquemas e tipagem
- [JWT](https://jwt.io/) — autenticação stateless
- [Swagger / OpenAPI](https://swagger.io/) — documentação automática da API

### Frontend
- [Next.js 15](https://nextjs.org/) (App Router) — framework React com SSR
- [React 19](https://react.dev/) — biblioteca de UI
- [TanStack Query](https://tanstack.com/query) — cache e sincronização de dados do servidor
- [Zustand](https://zustand-demo.pmnd.rs/) — gerenciamento de estado global
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) — formulários com validação
- [Recharts](https://recharts.org/) — gráficos
- [Tailwind CSS v4](https://tailwindcss.com/) — estilização
- [Orval](https://orval.dev/) — geração automática do cliente HTTP a partir do OpenAPI

## Pré-requisitos

- Node.js 20+
- PostgreSQL rodando localmente ou via Docker

## Início rápido

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd budgetly-app

# 2. Configure e inicie o backend
cd budgetly-app-backend
cp .env.example .env   # edite com suas credenciais
npm install
npx prisma migrate dev
npm run dev

# 3. Em outro terminal, configure e inicie o frontend
cd budgetly-app-frontend
cp .env.example .env.local   # edite com a URL do backend
npm install
npm run dev
```

O frontend ficará disponível em `http://localhost:3000` e o backend em `http://localhost:3333`.

Consulte os READMEs específicos de cada pacote para instruções detalhadas:
- [Backend](./budgetly-app-backend/README.md)
- [Frontend](./budgetly-app-frontend/README.md)
