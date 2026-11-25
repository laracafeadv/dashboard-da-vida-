import { addDays, fromISO, nextWeekday, toISO, WEEKDAYS } from './dates';

export const AREAS: Record<string, string> = {
  saude: 'Saúde', corpo: 'Saúde', sono: 'Saúde',
  carreira: 'Carreira', trabalho: 'Carreira', escritorio: 'Carreira',
  financas: 'Finanças', dinheiro: 'Finanças',
  estudos: 'Estudos', estudo: 'Estudos', leitura: 'Estudos',
  familia: 'Família', amigos: 'Amizades', amizades: 'Amizades',
  relacionamento: 'Relacionamento', casa: 'Casa', lazer: 'Lazer', pessoal: 'Pessoal',
};

const WEEKDAY_INDEX: Record<string, number> = {
  dom: 0, domingo: 0, seg: 1, segunda: 1, ter: 2, terca: 2, qua: 3, quarta: 3,
  qui: 4, quinta: 4, sex: 5, sexta: 5, sab: 6, sabado: 6,
};

export interface ParsedCapture {
  title: string;
  date: string;
  dateLabel: string;
  time?: string;
  area?: string;
  star: boolean;
  waiting: boolean;
}

const strip = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/**
 * Interpreta uma anotação escrita em linguagem natural.
 * Ex.: "pagar IPVA sexta 15h #finanças !" → tarefa na próxima sexta, 15:00, área Finanças, prioridade.
 */
export function parseCapture(input: string, today: string): ParsedCapture {
  // Trabalhamos em paralelo com o texto original e uma versão sem acentos do mesmo tamanho.
  let text = ` ${input} `;
  const out: ParsedCapture = { title: '', date: today, dateLabel: 'hoje', star: false, waiting: false };

  const take = (re: RegExp) => {
    const m = strip(text).match(re);
    if (m && m.index !== undefined) text = text.slice(0, m.index) + ' ' + text.slice(m.index + m[0].length);
    return m;
  };

  let m: RegExpMatchArray | null;
  if (take(/\s(?:para\s|pra\s)?amanha\s/)) {
    out.date = addDays(today, 1); out.dateLabel = 'amanhã';
  } else if (take(/\s(?:para\s|pra\s)?depois de amanha\s/)) {
    out.date = addDays(today, 2); out.dateLabel = 'depois de amanhã';
  } else if (take(/\shoje\s/)) {
    // mantém hoje
  } else if ((m = take(/\s(?:dia\s)?(\d{1,2})\/(\d{1,2})\s/))) {
    const year = fromISO(today).getFullYear();
    const d = new Date(year, Number(m[2]) - 1, Number(m[1]));
    if (toISO(d) < today) d.setFullYear(year + 1);
    out.date = toISO(d); out.dateLabel = `${m[1]}/${m[2]}`;
  } else if ((m = take(/\sdia\s(\d{1,2})\s/))) {
    const d = fromISO(today);
    const day = Number(m[1]);
    if (day < d.getDate()) d.setMonth(d.getMonth() + 1);
    d.setDate(day);
    out.date = toISO(d); out.dateLabel = `dia ${day}`;
  } else if ((m = take(/\s(?:na\s|no\s|ate\s|para\s|pra\s)?(domingo|segunda|terca|quarta|quinta|sexta|sabado|seg|ter|qua|qui|sex|sab|dom)(?:-feira)?\s/))) {
    const wd = WEEKDAY_INDEX[m[1]];
    out.date = nextWeekday(today, wd); out.dateLabel = WEEKDAYS[wd];
  } else if (take(/\s(?:na\s)?(?:semana que vem|proxima semana)\s/)) {
    out.date = nextWeekday(today, 1); out.dateLabel = 'segunda que vem';
  }

  if ((m = take(/\s(?:as\s)?(\d{1,2})(?:h|:)(\d{2})?h?\s/))) {
    const h = Number(m[1]);
    if (h < 24) out.time = `${String(h).padStart(2, '0')}:${m[2] ?? '00'}`;
  }

  if ((m = take(/\s#([a-z0-9_]+)/))) {
    const key = m[1];
    out.area = AREAS[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
  }

  if (/!/.test(text)) { out.star = true; text = text.replace(/!/g, ' '); }
  if (take(/\s@(espera|aguardando|esperando)\s/)) out.waiting = true;

  const title = text.replace(/\s+/g, ' ').trim().replace(/\s(?:ate|até)$/i, '');
  out.title = title.charAt(0).toUpperCase() + title.slice(1);
  return out;
}
