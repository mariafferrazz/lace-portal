# LACE Portal

Portal digital do **Laboratório de Agenciamentos Cotidianos e Experiências (LACE/UFF)**, desenvolvido para reunir, organizar e divulgar pesquisas, produções acadêmicas e audiovisuais, acervos temáticos, eventos e atividades do laboratório.

> Projeto full stack em desenvolvimento, concebido para transformar um acervo acadêmico amplo em uma experiência digital acessível, pesquisável e sustentável.

## Sobre o projeto

O LACE Portal centraliza diferentes frentes de produção do laboratório em uma arquitetura editorial organizada. A plataforma combina um site público responsivo com uma área administrativa protegida, permitindo que coordenação, pesquisadores e estudantes alimentem o acervo de forma estruturada.

Entre os conteúdos já contemplados estão filmes, verbetes históricos, entrevistas, podcasts, artigos, pesquisas, traduções e eventos. A primeira coleção digital implementada é **Cinema e Ditadura**, com catálogo alfabético, reprodução de vídeos, textos de referência e relações entre filmes e verbetes.

## Funcionalidades

- Catálogo de filmes organizado alfabeticamente.
- Reprodução de vídeos do YouTube e Vimeo em modal responsivo.
- Navegação entre filmes e verbetes por botões laterais e teclado.
- Glossário temático com textos extensos, autoria, referências e imagens contextuais.
- Relacionamento interno entre verbetes e filmes do acervo.
- Filtros alfabéticos gerados dinamicamente conforme o conteúdo disponível.
- Área administrativa com autenticação e controle de acesso por perfil.
- Fluxo editorial com conteúdos em revisão ou publicados.
- Cadastro categorizado por área editorial e tipo de conteúdo.
- Registro obrigatório do nome do pesquisador responsável.
- Interface responsiva e recursos de navegação por teclado.

## Áreas editoriais

| Área | Tipos de conteúdo |
| --- | --- |
| Cinema e Ditadura | Filmes e verbetes |
| Produção Audiovisual | Entrevistas e podcasts |
| Produção Acadêmica | Artigos, pesquisas e traduções |
| Eventos e Atividades | Eventos e Linhas de Fugas Virais |

## Tecnologias

### Frontend

- React 19
- React Router
- Vite
- Tailwind CSS
- Framer Motion
- Axios
- Lucide React

### Backend

- Node.js
- Express
- Prisma ORM
- MySQL/MariaDB
- Autenticação com JWT em cookie `httpOnly`
- Controle de acesso baseado em papéis

## Arquitetura

```text
lace-portal/
├── frontend/                         # Aplicação React e interface pública/admin
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── routes/
│       └── services/
└── backend/                          # API, autenticação e persistência
    ├── src/
    │   ├── middleware/
    │   └── routes/
    └── prisma/
        ├── migrations/
        └── imports/
            └── cinema-e-ditadura/
                ├── filmes/
                └── verbetes/
```

Os importadores são separados por área editorial e tipo de conteúdo. O schema e as migrações permanecem na raiz do Prisma por representarem o banco de dados completo.

## Como executar localmente

### Pré-requisitos

- Node.js 20 ou superior
- MySQL ou MariaDB
- npm

### 1. Clone o repositório

```bash
git clone https://github.com/mariafferrazz/lace-portal.git
cd lace-portal
```

### 2. Configure o backend

```bash
cd backend
npm install
```

Copie `.env.example` para `.env` e informe a conexão com o banco e um segredo JWT.

```bash
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
```

A API será iniciada em `http://localhost:3000`.

### 3. Configure o frontend

Em outro terminal:

```bash
cd frontend
npm install
```

Copie `.env.example` para `.env` se desejar configurar explicitamente a URL da API.

```bash
npm run dev -- --port 5174
```

O portal estará disponível em `http://localhost:5174`.

## Variáveis de ambiente

### Backend

| Variável | Finalidade |
| --- | --- |
| `DATABASE_URL` | Conexão MySQL/MariaDB utilizada pelo Prisma |
| `JWT_SECRET` | Assinatura dos tokens de autenticação |
| `FRONTEND_URL` | Origem autorizada para CORS |
| `PORT` | Porta da API, padrão `3000` |
| `NODE_ENV` | Ambiente de execução |

### Frontend

| Variável | Finalidade |
| --- | --- |
| `VITE_API_URL` | Endereço público da API |

## Perfis de acesso

- **Coordenação:** publica, retira e exclui conteúdos, além de acompanhar todo o acervo.
- **Pesquisadores e estudantes:** cadastram materiais para revisão da coordenação.

Credenciais reais não são armazenadas no repositório. Usuários locais devem ser configurados por variáveis seguras ou pelo processo de seed adequado ao ambiente.

## Qualidade e segurança

- Cookies de autenticação `httpOnly` e `sameSite`.
- Senhas protegidas com hash usando bcrypt.
- CORS limitado às origens configuradas.
- Cabeçalhos básicos de segurança na API.
- Validação dos tipos de conteúdo no backend.
- Build de produção e verificação sintática usados durante o desenvolvimento.
- Arquivos de ambiente e dados sensíveis ignorados pelo Git.

## Próximos passos

- Ampliar as coleções de Produção Audiovisual e Produção Acadêmica.
- Estruturar páginas dinâmicas para entrevistas, podcasts e eventos.
- Evoluir os formulários administrativos conforme cada tipo de conteúdo.
- Adicionar testes automatizados de frontend e API.
- Preparar implantação, armazenamento de mídia e observabilidade.
- Aprimorar continuamente acessibilidade e desempenho.

## Contexto institucional

O **Laboratório de Agenciamentos Cotidianos e Experiências (LACE)** está vinculado à Universidade Federal Fluminense. O portal busca fortalecer a circulação pública do conhecimento produzido pelo laboratório e preservar seus acervos em uma infraestrutura digital organizada.

## Autoria

Projeto desenvolvido por **Maria Ferraz**, em colaboração com o LACE/UFF.

---

Este repositório encontra-se em desenvolvimento ativo. Sugestões e contribuições são bem-vindas por meio das issues do GitHub.
