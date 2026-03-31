# Budgetly — Backend

API REST do Budgetly construída com Fastify, Prisma ORM e PostgreSQL.

## Tecnologias

| Pacote | Versão | Função |
|---|---|---|
| Fastify | 5 | Framework HTTP |
| Prisma | 7 | ORM e migrations |
| PostgreSQL | — | Banco de dados |
| Zod | 4 | Validação de schemas e tipos |
| @fastify/jwt | — | Autenticação JWT |
| fastify-bcrypt | — | Hash de senhas |
| @fastify/swagger | — | Documentação OpenAPI |
| tsx | — | Execução TypeScript em desenvolvimento |

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do pacote com:

```env
PORT=3333
DATABASE_URL="postgresql://usuario:senha@localhost:5432/budgetly"
JWT_SECRET_KEY="sua-chave-secreta"
BASE_URL="http://localhost:3333"
```
## Docker

Para rodar o Docker Compose, utilize o comando:

```bash
docker compose up -d
```

## Instalação e execução

```bash
npm install

# Criar o banco e rodar as migrations
npx prisma migrate dev

# Popular o banco com dados iniciais (opcional)
npm run db:seed

# Iniciar em modo desenvolvimento (hot reload)
npm run dev
```

## Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor com hot reload via `tsx watch` |
| `npm run db:seed` | Popula o banco com dados de exemplo |
| `npm run db:reset` | Reseta o banco e roda as migrations do zero |
| `npm run vercel-build` | Gera o cliente Prisma e roda migrations (CI/CD) |

## Documentação da API

Com o servidor rodando, acesse `http://localhost:3333/docs` para visualizar a documentação interativa gerada pelo Swagger UI.

## Estrutura de pastas

```
src/
├── controllers/     # Handlers de rota (FastifyPluginAsyncZod)
│   ├── accounts.ts
│   ├── categories.ts
│   ├── transactions.ts
│   ├── dashboard.ts
│   ├── financial.ts
│   ├── main.ts
│   └── users.ts
├── services/        # Lógica de negócio e acesso ao banco
│   ├── accounts.ts
│   ├── categories.ts
│   ├── transactions.ts
│   ├── balances.ts
│   ├── dashboard.ts
│   ├── financial.ts
│   └── users.ts
├── schemas/         # Schemas Zod reutilizáveis
├── routes/
│   └── main.ts      # Registro de todas as rotas
├── prisma/
│   └── schema.prisma
├── errors/
│   └── http.ts      # Erros HTTP tipados
├── mappers/         # Transformações de entidades
├── lib/
│   └── prisma.ts    # Instância singleton do PrismaClient
├── env.ts           # Validação de variáveis de ambiente
├── app.ts           # Configuração do Fastify (plugins, JWT, Swagger)
└── server.ts        # Ponto de entrada
```

## Modelo de dados

```
User
 ├── Account[]      (CHECKING | SAVING | CREDIT | CASH)
 ├── Category[]     (type: INCOME | EXPENSE)
 └── Transaction[]  (vinculada a Account + Category)
```

- Uma **Category** tem tipo fixo (`INCOME` ou `EXPENSE`). Ao criar uma transação, o tipo da transação deve coincidir com o da categoria.
- O **saldo** de uma conta é calculado dinamicamente somando as receitas e subtraindo as despesas via `aggregate` no banco.
- O campo `descriptionNormalized` armazena a descrição sem acentos para viabilizar busca case-insensitive.

## Endpoints principais

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth` | Login |
| POST | `/users` | Registro |
| GET | `/user` | Dados do usuário autenticado |
| GET | `/accounts` | Listar contas com saldo |
| POST | `/account` | Criar conta |
| PATCH | `/account/:id` | Editar conta |
| DELETE | `/account/:id` | Excluir conta |
| GET | `/categories` | Listar categorias |
| POST | `/category` | Criar categoria |
| PATCH | `/category/:id` | Editar categoria |
| DELETE | `/category/:id` | Excluir categoria |
| GET | `/transactions` | Listar transações (com filtros) |
| POST | `/transaction` | Criar transação |
| PATCH | `/transaction/:id` | Editar transação |
| DELETE | `/transaction/:id` | Excluir transação |
| GET | `/financial` | Visão financeira geral |
| GET | `/financial/summary` | Resumo de transações recentes |
| GET | `/dashboard/*` | Dados para gráficos do dashboard |
