# Biblioteca do Colégio Estadual Laurentino Martins

Sistema de biblioteca escolar com catálogo público, reservas, empréstimos, gamificação de leitores e painel administrativo.

## Stack

- Next.js 16 (App Router) e React 19
- Prisma 5 com PostgreSQL (Neon)
- Tailwind CSS 4
- TypeScript, ESLint e Radix UI

## Pré-requisitos

- Node.js 20+
- Conta no Neon (ou outro PostgreSQL acessível)
- npm

## Configuração

1. Copie o arquivo de exemplo e preencha as variáveis:

   ```bash
   cp .env.example .env.local
   ```

   Variáveis obrigatórias:

   - `DATABASE_URL` — conexão poolada usada em runtime.
   - `DIRECT_URL` — conexão direta usada pelo Prisma para migrações.
   - `SESSION_SECRET` — segredo aleatório de no mínimo 32 caracteres para assinar os cookies de sessão (obrigatório em produção).

   Opcionais: `ADMIN_TOKEN`, `CLOUDINARY_*` e, apenas para o script de criação de administrador, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (mínimo de 12 caracteres) e `ADMIN_NAME`.

2. Instale as dependências (o `postinstall` gera o Prisma Client):

   ```bash
   npm install
   ```

3. Aplique o schema ao banco:

   ```bash
   npx prisma db push
   ```

4. Crie o primeiro administrador **definindo as credenciais no ambiente** (o script não aceita senha padrão):

   ```bash
   ADMIN_EMAIL=admin@escola.local ADMIN_PASSWORD="senha-forte-aqui" npx tsx scripts/create-admin.ts
   ```

5. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

   Acesse [http://localhost:3000](http://localhost:3000).

## Comandos úteis

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run lint` | Análise estática (ESLint) |
| `npx tsc --noEmit` | Verificação de tipos |
| `npm run validate:routes` | Valida links internos e rotas dinâmicas do projeto |
| `npm run test:flows` | Testes de fluxo ponta a ponta |

## Estrutura principal

- `src/app/(public)` — catálogo de livros e detalhes (`/livros`).
- `src/app/admin` — dashboard, alunos, livros, reservas e empréstimos.
- `src/app/api` — rotas de API com autenticação (`requireAdmin`, `requireStudent`).
- `src/components` — componentes reutilizáveis (tabelas, modais, cards e navegação).
- `src/lib` — Prisma, segurança, formatação de datas e integrações.
- `prisma/schema.prisma` — modelos de dados.
- `public/Imagens` — imagens institucionais usadas na landing page e no dashboard.

## Convenções

- Textos de interface em português do Brasil.
- Datas exibidas sempre via `formatDateBR` / `formatDateTimeBR` (fuso `America/Sao_Paulo`).
- Cores e superfícies usando os tokens do Tailwind (`bg-card`, `border-border`, `text-foreground`), com suporte a tema escuro.
- Imagens com `next/image`; imagens institucionais ficam em `public/Imagens`.
