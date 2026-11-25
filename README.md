# Diário da Vida

Dashboard pessoal de rotina, metas e pensamentos — site em Next.js.

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # testes do leitor de anotações
npm run build    # versão de produção
```

## Colocar no ar (hospedagem)

O site é um projeto Next.js comum. O caminho mais simples é a **Vercel** (gratuita para uso pessoal), com os dados no **Supabase**.

### 1. Banco de dados (Supabase)
1. Em [supabase.com/dashboard](https://supabase.com/dashboard), crie um projeto (região *South America – São Paulo*).
2. Abra **SQL Editor** e rode, nesta ordem, o conteúdo de:
   - `supabase/migrations/0001_user_state.sql` (dados do dia a dia, com segurança por usuária);
   - `supabase/migrations/0002_caderno_imagens.sql` (pasta privada para prints e fotos do Caderno).
3. Em **Authentication → Sign In / Providers → Email**, deixe *Email* ligado. Para não precisar confirmar o e-mail ao criar a conta, desligue *Confirm email*.
4. Em **Project Settings → API**, copie a *Project URL* e a chave *anon / publishable*.

### 2. Site (Vercel)
1. Em [vercel.com/new](https://vercel.com/new), importe este repositório do GitHub (branch `claude/personal-life-dashboard-0buo0g` ou a principal, depois de juntar).
2. Em **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL` = a Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = a chave anon / publishable
3. Clique em **Deploy**. O endereço gerado (algo como `diario-da-vida.vercel.app`) já funciona no celular.

> Sem as duas variáveis o site também funciona, mas guarda tudo só no aparelho e não pede login.

### 3. No iPhone
Abra o endereço no **Safari** → botão **Compartilhar** → **Adicionar à Tela de Início**. O Diário abre como um app, em tela cheia, com ícone próprio.

## Estrutura

```
src/
  app/               páginas (Hoje em page.tsx; demais seções em [secao])
    globals.css      sistema visual: tokens das 3 direções vintage
    hoje.css         estilos da página Hoje
  components/
    shell/           topo, navegação do celular, login, avisos
    caderno/         registro rápido, imagens, busca
    hoje/            frontispício, anotar, resumo, prioridades, tarefas, agenda, rotina, metas, fechar o dia
    ui/ornaments     ornamentos, selo e ícones
  lib/
    parse.ts         entende "pagar IPVA sexta 15h #finanças !"
    store.ts         dados e automações (migração de tarefas, rotina → metas, encerrar o dia, caderno)
    sync.ts          sincronização com a nuvem (Supabase)
    images.ts        compressão e armazenamento de imagens
    briefing.ts      resumo da manhã (regras hoje; IA na fase seguinte)
    sample.ts        dados de exemplo
docs/
  ARQUITETURA.md     análise e arquitetura do produto
  previews/          capturas da interface real
```

## Estado atual

- Identidade "Papel": fontes da referência (Cormorant Garamond em versais + Instrument Serif itálico), papel claro e tinta escura, uma coluna com muito respiro. Tela **Hoje** enxuta: prioridades, agenda, lista do dia (tarefas + rotina), metas em uma linha e encerrar o dia.
- Motivos visuais em `src/components/ui/vintage.tsx`; cores e fontes em `src/app/globals.css` (`:root`).
- **Caderno**: pensamentos e referências com texto, ditado, prints e fotos; temas, pastas, busca, edição com histórico de versões. A IA entra depois.
- **Nuvem**: login por e-mail e senha e sincronização automática, ligados quando as variáveis do Supabase estão configuradas.
