# Railway Infrastructure as Code

Este projeto usa `.railway/railway.ts` no lugar do `railway.json` descontinuado.

As variáveis de ambiente continuam gerenciadas exclusivamente no Railway. Valores e segredos não são importados para o repositório.

## Verificação

```powershell
npm ci
railway config plan
```

Um plano seguro deve mostrar `0 to destroy` e nenhuma alteração de variáveis, banco ou volume.

## Aplicação

```powershell
railway config apply
```

O SDK TypeScript fica fixado no projeto. Instale ou atualize o Railway CLI separadamente conforme a documentação oficial antes de executar os comandos.

Revise sempre o plano antes de aplicar. A configuração deste repositório possui a partial `lace-portal` e não gerencia o serviço MySQL.
