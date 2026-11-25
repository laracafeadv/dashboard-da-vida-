import type { CalendarEvent, RoutineItem, Task } from './types';

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export interface Briefing {
  paragraphs: string[];
  suggestion?: Task;
}

/**
 * Resumo da manhã montado por regras. Na fase com IA, o mesmo contrato
 * (parágrafos + sugestão) passa a ser escrito pelo Claude.
 */
export function buildBriefing(tasks: Task[], events: CalendarEvent[], routine: RoutineItem[], isToday: boolean): Briefing {
  const open = tasks.filter((t) => !t.done);
  const commitments = events.filter((e) => !e.free);
  const free = events.filter((e) => e.free);
  const rolled = open.filter((t) => t.rolled > 0);
  const stuck = open.filter((t) => t.rolled >= 3);
  const waiting = open.filter((t) => t.waiting);
  const stars = open.filter((t) => t.star);
  const doneStars = tasks.filter((t) => t.star && t.done);

  const p: string[] = [];
  const when = isToday ? 'Hoje' : 'Neste dia';
  let first = `${when} há ${plural(commitments.length, 'compromisso', 'compromissos')} na agenda, ${plural(open.length, 'tarefa em aberto', 'tarefas em aberto')}`;
  if (rolled.length) first += ` (${plural(rolled.length, 'veio', 'vieram')} de dias anteriores)`;
  first += ` e ${plural(routine.length, 'item', 'itens')} de rotina.`;
  if (free.length) first += ` O intervalo das ${free[0].start} está livre; vale protegê-lo.`;
  p.push(first);

  const second: string[] = [];
  if (stuck.length) second.push(`“${stuck[0].title}” já foi adiada ${stuck[0].rolled} vezes e pede uma decisão, não mais um adiamento.`);
  if (waiting.length) second.push(`${plural(waiting.length, 'item depende', 'itens dependem')} de outra pessoa; não conte com ${waiting.length === 1 ? 'ele' : 'eles'} para fechar o dia.`);
  if (second.length) p.push(second.join(' '));

  const suggestion =
    stars.length + doneStars.length < 3
      ? [...open].filter((t) => !t.star && !t.waiting).sort((a, b) => b.rolled - a.rolled)[0]
      : undefined;

  return { paragraphs: p, suggestion };
}
