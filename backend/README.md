# Backend LACE

API Express conectada ao MySQL `lace_db` com autenticação por cookie HTTP-only.

## Perfis

- `COORDINATOR`: duas contas individuais; cadastra, edita, publica e exclui conteúdos.
- `CONTRIBUTOR`: conta coletiva de pesquisadores e estudantes; cadastra e edita conteúdos, mas não publica nem exclui.

Todo conteúdo exige `researcherName`, independentemente da conta usada. A API também registra `createdById` para auditoria.

## Configuração

1. Copie as variáveis de `.env.example` para `.env` e preencha as credenciais reais.
2. Execute `npm install`.
3. Execute `npm run prisma:migrate`.
4. Execute `npm run seed` para criar ou atualizar as três contas.
5. Execute `npm run dev`.

## Rotas principais

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/contents` — conteúdos publicados
- `GET /api/contents/manage` — área autenticada
- `POST /api/contents` — exige título, tipo e nome do pesquisador
- `PATCH /api/contents/:id`
- `DELETE /api/contents/:id` — somente coordenação
