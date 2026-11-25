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

- Identidade "Papel": fontes da referência (Cormorant Garamond em versais + Instrument Serif itálico), papel claro e tinta escura, uma coluna com muito respiro. Tela **Hoje** enxuta: prioridades, agenda, lista do dia (tarefas + rotina), metas em uma linha e encerrar o dia.
- Motivos visuais em `src/components/ui/vintage.tsx`; cores e fontes em `src/app/globals.css` (`:root`).
- Os dados ficam no navegador (localStorage). Próximo passo de infraestrutura: Supabase para sincronizar celular e computador.
