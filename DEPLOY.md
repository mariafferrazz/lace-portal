# Deploy do LACE Portal

Este projeto sera publicado com:

- Frontend React/Vite na Vercel.
- Backend Express na Railway.
- MySQL na Railway.
- Dominio proprio: `lablace.com.br`.

## 1. Dominio

Compre `lablace.com.br` no Registro.br.

Depois de criar os projetos na Vercel e Railway, configure:

- `lablace.com.br` e `www.lablace.com.br` na Vercel.
- `api.lablace.com.br` na Railway, apontando para o servico do backend.

## 2. Frontend na Vercel

Crie um novo projeto na Vercel a partir do GitHub:

- Repository: `mariafferrazz/lace-portal`
- Root Directory: `frontend`
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

Variavel de ambiente de producao:

```env
VITE_API_URL=https://api.lablace.com.br/api
VITE_CONTACT_ENDPOINT=https://script.google.com/macros/s/SEU_DEPLOY_ID/exec
```

Dominios:

- `www.lablace.com.br`
- `lablace.com.br`

Configure o dominio principal como `www.lablace.com.br` e redirecione o dominio raiz para ele.

## 3. Backend na Railway

Crie um projeto na Railway e adicione:

- Um servico MySQL.
- Um servico Node.js conectado ao mesmo repositorio GitHub.

No servico Node.js:

- Root Directory: `backend`
- Start Command: `npm start`

Variaveis de ambiente:

```env
NODE_ENV=production
JWT_SECRET=gere-um-segredo-longo-e-aleatorio
FRONTEND_URL=https://www.lablace.com.br
FRONTEND_URLS=https://lablace.com.br,https://www.lablace.com.br
DATABASE_URL=${{MySQL.MYSQL_URL}}
```

Para a coordenadora receber e-mail quando pesquisadoras ou pesquisadores enviarem conteudo para revisao, configure tambem no Railway:

```env
COORDINATOR_NOTIFY_EMAIL=joanadferraz@gmail.com
COORDINATOR_NOTIFY_WEBHOOK_URL=https://script.google.com/macros/s/SEU_DEPLOY_ID/exec
```

Use um endpoint seguro, como o Google Apps Script ja usado no formulario de contato. Se essa URL nao estiver configurada, o envio continua funcionando, mas o backend apenas registra no log que a notificacao nao foi enviada.

Tambem configure as contas iniciais usadas pelo seed:

```env
COORDINATOR_1_NAME=
COORDINATOR_1_EMAIL=
COORDINATOR_1_PASSWORD=
COORDINATOR_2_NAME=
COORDINATOR_2_EMAIL=
COORDINATOR_2_PASSWORD=
CONTRIBUTOR_NAME=
CONTRIBUTOR_EMAIL=
CONTRIBUTOR_PASSWORD=
```

Depois do primeiro deploy, rode o seed uma vez no Railway:

```bash
npm run seed
```

## 4. DNS

Na Vercel, ao adicionar `lablace.com.br` e `www.lablace.com.br`, copie os registros DNS que ela indicar e coloque no Registro.br.

Na Railway, ao adicionar `api.lablace.com.br`, copie o `CNAME` indicado e coloque no Registro.br.

Quando DNS e SSL estiverem propagados:

- Site: `https://www.lablace.com.br`
- API: `https://api.lablace.com.br/api/health`

## 5. Observacao sobre acervo publico

As paginas publicas de filmes, verbetes e mostras possuem fallback estatico. Isso evita que o site fique vazio caso a API esteja indisponivel.

Quando a API estiver no ar, o frontend usa os dados do banco automaticamente.
