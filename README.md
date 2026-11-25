# Diário da Vida

Dashboard pessoal de rotina, metas e pensamentos — site em Next.js.

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # testes do leitor de anotações
npm run build    # versão de produção
```

## Estrutura

```
src/
  app/               páginas (Hoje em page.tsx; demais seções em [secao])
    globals.css      sistema visual: tokens das 3 direções vintage
    hoje.css         estilos da página Hoje
  components/
    shell/           barra lateral, navegação do celular, avisos
    hoje/            frontispício, anotar, resumo, prioridades, tarefas, agenda, rotina, metas, fechar o dia
    ui/ornaments     ornamentos, selo e ícones
  lib/
    parse.ts         entende "pagar IPVA sexta 15h #finanças !"
    store.ts         dados e automações (migração de tarefas, rotina → metas, fechar o dia)
    briefing.ts      resumo da manhã (regras hoje; IA na fase seguinte)
    sample.ts        dados de exemplo
docs/
  ARQUITETURA.md     análise e arquitetura do produto
  previews/          capturas da interface real
```

## Estado atual

- Identidade "Editorial": só fontes e cores das referências (chocolate, papel creme, vinho; Libre Caslon Display, EB Garamond e assinatura Ms Madi), em grade dividida por fios finos. Aplicada à estrutura e à tela **Hoje**, responsiva. Versões anteriores estão no histórico do git.
- Motivos visuais em `src/components/ui/vintage.tsx`; cores e fontes em `src/app/globals.css` (`:root`).
- Os dados ficam no navegador (localStorage). Próximo passo de infraestrutura: Supabase para sincronizar celular e computador.
