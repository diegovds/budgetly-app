# Budgetly — Frontend

Interface web do Budgetly construída com Next.js 15 (App Router) e React 19.

## Tecnologias

| Pacote | Versão | Função |
|---|---|---|
| Next.js | 15 | Framework React com App Router |
| React | 19 | Biblioteca de UI |
| TanStack Query | 5 | Cache e sincronização com a API |
| Zustand | 5 | Estado global (modal, auth) |
| React Hook Form | 7 | Gerenciamento de formulários |
| Zod | 4 | Validação de schemas |
| Recharts | 2 | Gráficos do dashboard |
| Tailwind CSS | 4 | Estilização utilitária |
| Orval | 7 | Geração do cliente HTTP a partir do OpenAPI |
| Sonner | — | Notificações toast |
| date-fns | 4 | Manipulação de datas |

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do pacote com:

```env
NEXT_PUBLIC_BACKEND_URL="http://localhost:3333"
```

## Instalação e execução

```bash
npm install
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

## Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia em desenvolvimento com Turbopack |
| `npm run build` | Gera o build de produção |
| `npm run start` | Inicia o servidor de produção |
| `npm run lint` | Executa o ESLint |

## Estrutura de pastas

```
src/
├── app/                        # Rotas (Next.js App Router)
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── account/page.tsx
│   ├── category/page.tsx
│   ├── dashboard/page.tsx
│   ├── transaction/page.tsx
│   └── page.tsx                # Home (visão geral)
├── components/
│   ├── account/
│   │   ├── account-grid.tsx    # Listagem paginada de contas
│   │   └── account-management.tsx  # Edição/exclusão via modal
│   ├── category/
│   │   ├── category-list.tsx   # Listagem paginada de categorias
│   │   └── category-management.tsx
│   ├── transaction/
│   │   ├── transaction-grid.tsx
│   │   └── transaction-management.tsx
│   ├── modal.tsx               # Modal global controlado pelo Zustand
│   ├── new-account.tsx
│   └── ui/                     # Componentes base (Button, Input, Form…)
├── hooks/                      # Mutations do TanStack Query
│   ├── useAccountDeleteMutation.ts
│   ├── useAccountInsertionMutation.ts
│   ├── useAccountUpdateMutation.ts
│   ├── useCategoryDeleteMutation.ts
│   ├── useCategoryInsertionMutation.ts
│   ├── useCategoryUpdateMutation.ts
│   ├── useTransactionDeleteMutation.ts
│   ├── useTransactionInsertionMutation.ts
│   └── useTransactionUpdateMutation.ts
├── http/
│   └── api.ts                  # Cliente HTTP (gerado via Orval)
├── store/
│   ├── useModalStore.ts.ts     # Estado do modal global
│   ├── auth.ts
│   ├── account.ts
│   ├── account-type.ts
│   ├── categories.ts
│   └── category-type.ts
├── actions/                    # Server Actions Next.js (cookies de auth)
├── utils/
│   ├── format.ts               # Formatação de moeda e datas
│   └── search-params.ts
├── lib/
│   └── utils.ts                # Utilitários (cn, etc.)
├── middleware.ts               # Proteção de rotas
└── env.ts                      # Validação de variáveis de ambiente
```

## Padrões arquiteturais

**Cliente HTTP**
O arquivo `src/http/api.ts` é gerado pelo [Orval](https://orval.dev/) a partir do OpenAPI exportado pelo backend. Após alterar endpoints no backend, regenere com:
```bash
npx orval
```

**Modal global**
Todas as ações de criação/edição/exclusão (contas, categorias, transações) são feitas via um modal único controlado pelo store `useModalStore`. O componente `<Modal>` decide qual formulário renderizar com base no campo `whoOpened`.

**Autenticação**
O token JWT é armazenado em cookie via Server Action (`set-auth-cookie`). O middleware do Next.js valida o cookie em cada requisição e redireciona para `/login` quando necessário.

**Mutations**
Cada operação de escrita tem seu próprio hook em `src/hooks/`. Ao completar com sucesso, o hook invalida as queries relevantes no TanStack Query, forçando refetch automático dos dados na tela.

## Páginas

| Rota | Descrição |
|---|---|
| `/login` | Autenticação |
| `/register` | Criação de conta |
| `/` | Home com visão geral e transações recentes |
| `/account` | Gerenciamento de contas bancárias |
| `/category` | Gerenciamento de categorias |
| `/transaction` | Listagem de transações com filtros |
| `/dashboard` | Gráficos e relatórios financeiros |
