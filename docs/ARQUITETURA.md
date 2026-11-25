# Dashboard da Vida — análise e arquitetura proposta (v0)

## 1. Diagnóstico
O briefing descreve 6 módulos principais e 17 ferramentas complementares. Muitas delas fazem a mesma coisa:
- **Metas** aparecem em 6 lugares: metas mensais, metas semestrais, focos do Raio-X, metas de Saúde, de Estudos e de Finanças.
- **Revisões** aparecem em 5: revisão semanal, compromissos mensais, Raio-X, check-in semestral e retrospectiva anual.
- **Recorrência** aparece em 4: rotina-padrão, hábitos nos pilares, compromissos mensais e a regra "tarefa recorrente vira processo".
- **Captura com IA** aparece em 4: Repositório, Brain Dump, Banco de aprendizados e Jardim digital.
- **Áreas da vida** usam três listas diferentes: as 10 áreas do Raio-X, os 6 pilares e as áreas das metas semestrais. "Mente" só existe nos pilares; Família, Amizades e Lazer só existem no Raio-X.

**Maior risco:** os registros diários (sono, exercício, emoções, hábitos, páginas lidas, despesas, pomodoro) somam 7 obrigações por dia. Isso vai contra o requisito "não virar mais uma obrigação".

## 2. Princípios de arquitetura
1. **Uma única fonte para cada coisa.** Meta, rotina e área são entidades únicas. Os pilares mostram esses dados filtrados, mas não são donos deles.
2. **Regras viram comportamento do sistema, e não uma página para ler.** Exemplos: no máximo 3 prioridades, barra de capacidade, a pergunta "o que sai?" quando algo novo entra, próxima ação obrigatória e o estado "aguardando terceiros".
3. **Um check-in diário de até 60 segundos.** Os pilares leem os dados desse check-in.
4. **Cascata de prioridades:** Ano → Semestre → Mês (3 focos) → Semana → Hoje (3 prioridades).
5. **Nada é convertido automaticamente,** mas existe um botão explícito "enviar para…". Isso evita que o Brain Dump vire uma segunda caixa de entrada que nunca é processada.

## 3. Navegação (5 itens)
| Item | Conteúdo | O que absorve do briefing |
|---|---|---|
| **Hoje** (início) | 3 prioridades, agenda, tarefas, check-in, modo foco, captura rápida | Visão geral, Hoje, Pomodoro (7.3), registros diários |
| **Planejar** | Semana (capacidade, triagem, assistente de IA), Metas (cascata e engenharia reversa), Rotina (recorrências, hábitos, versão mínima) | 4, 7.2, 7.10, 7.11, 7.14, 7.15, 7.16 |
| **Áreas da vida** | Raio-X + páginas por área: Saúde e sono, Mente, Estudos (cursos, leitura, trilhas com IA), Finanças, Carreira (projetos, portfólio), Relações, Lazer e Propósito | 5, 6, 7.4, 7.5, 7.6, 7.7, 7.12 |
| **Caderno** | Brain Dump + Biblioteca (referências, aprendizados, conexões), com o mesmo motor de "entrada → instrução → versões" e instruções salvas | 2, 3, 7.8, 7.9 |
| **Revisões** | Semanal · Mensal (Raio-X + manutenção + escolha dos 3 focos) · Semestral (check-in + mapa de energia) · Anual (montada com marcos registrados ao longo do ano) | 4, 5, 7.1, 7.13, 7.14, 7.17 |

## 4. Decisão sobre cada ferramenta complementar
| Ferramenta | Decisão | Motivo |
|---|---|---|
| 7.1 Retrospectiva anual | Vira parte de Revisões | Construída com marcos e revisões semanais, para não começar de uma página em branco |
| 7.2 Matriz de prioridades | Vira uma etapa de triagem do planejamento semanal | Como tela separada, só reordena a mesma lista de tarefas |
| 7.3 Pomodoro | Vira o modo foco dentro de Hoje | O tempo registrado ajuda a calibrar as estimativas da 7.10 |
| 7.4 Portfólio | Entra em Carreira (fase 4) | — |
| 7.5 Leitura | Funde com Estudos | Já estava duplicada |
| 7.6 Viagens | Adiada; seria um modelo de projeto dentro de Lazer | É raro e não se conecta ao resto |
| 7.7 Professora de IA | Entra em Estudos (fase 5) | Tem escopo de um produto inteiro |
| 7.8 Banco de aprendizados | Vira um tipo de registro na Biblioteca | O gesto de captura é o mesmo |
| 7.9 Jardim digital | Vira uma visualização (tags e conexões) da Biblioteca | Não justifica um módulo próprio |
| 7.10 Assistente de agenda | Vira uma etapa do planejamento semanal | É o único fluxo em que despejar ideias deve gerar tarefas |
| 7.11 Metas semestrais | Entra na cascata de Metas | — |
| 7.12 Financeiro | Funde com o pilar Finanças | Importar CSV/OFX é viável; PDF é frágil |
| 7.13 Virada de semestre | Vira a Revisão semestral | — |
| 7.14 Compromissos mensais | Vira a rotina mensal + Revisão mensal | — |
| 7.15 Rotina leve e 7.16 Regras | Viram comportamento do sistema + página "Princípios" exibida nas revisões | — |
| 7.17 Mapa de energia | Vira um exercício da Revisão semestral | O resultado alimenta Princípios e Rotina |

## 5. Metas: modelo de progresso
- **Resultado** (indicador numérico, por exemplo R$ 2.000 de reserva) → **marcos** → **ações**.
- Concluir uma tarefa atualiza o progresso **só em metas medidas por marcos**. Quando o progresso é contado por número de tarefas, o resultado fica distorcido: 10 tarefas pequenas não equivalem a uma entrega.

## 6. Fases
0. Fundação: identidade visual, navegação, banco de dados ← **em andamento**
1. Núcleo de execução: Hoje, Semana, Metas, Revisão semanal
2. Caderno com IA: Brain Dump, Biblioteca, motor de versões
3. Ritmo: Rotina, hábitos, check-in diário, Revisão mensal + Raio-X
4. Áreas: Estudos, Saúde e sono, Finanças, Carreira
5. Expansões: Professora de IA, Viagens, importação financeira, revisões semestral e anual

## 7. Stack proposta
Next.js + Supabase (banco, login e armazenamento de imagens) + Vercel + API do Claude chamada pelo servidor. Funciona no celular como PWA.
