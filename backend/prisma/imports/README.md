# Importações editoriais

Os importadores são organizados primeiro pela área exibida no portal e depois pelo tipo de conteúdo.

```text
imports/
├── cinema-e-ditadura/
│   ├── filmes/
│   └── verbetes/
├── producao-audiovisual/
│   ├── entrevistas/
│   └── podcasts/
├── producao-academica/
│   ├── artigos/
│   ├── pesquisas/
│   └── traducoes/
└── eventos-e-atividades/
    ├── eventos/
    └── linhas-de-fugas-virais/
```

As pastas das próximas áreas devem ser criadas junto com seus primeiros importadores. `schema.prisma`, migrações e `seed.js` permanecem na raiz de `prisma/`, pois descrevem o banco inteiro.

Exemplo de execução:

```powershell
node prisma/imports/cinema-e-ditadura/filmes/import-films-a.js
node prisma/imports/cinema-e-ditadura/verbetes/import-glossary-a.js
```
