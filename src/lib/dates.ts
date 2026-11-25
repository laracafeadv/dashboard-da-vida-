export const WEEKDAYS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
export const WEEKDAYS_SHORT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
export const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

export const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const fromISO = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const todayISO = () => toISO(new Date());

export const addDays = (s: string, n: number) => {
  const d = fromISO(s);
  d.setDate(d.getDate() + n);
  return toISO(d);
};

export const diffDays = (a: string, b: string) => Math.round((fromISO(b).getTime() - fromISO(a).getTime()) / 864e5);

/** Próxima ocorrência do dia da semana, estritamente depois de `from`. */
export const nextWeekday = (from: string, weekday: number) => {
  const d = fromISO(from);
  const diff = ((weekday - d.getDay() + 7) % 7) || 7;
  return addDays(from, diff);
};

export const nextMonday = (from: string) => nextWeekday(from, 1);

/** Segunda a domingo da semana que contém a data. */
export const weekOf = (s: string) => {
  const d = fromISO(s);
  const offset = (d.getDay() + 6) % 7;
  const monday = addDays(s, -offset);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
};

export const dayOfYear = (s: string) => {
  const d = fromISO(s);
  return Math.round((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 864e5);
};

export const weekNumber = (s: string) => {
  const d = fromISO(s);
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t.getTime() - yearStart.getTime()) / 864e5 + 1) / 7);
};

export const longDate = (s: string) => {
  const d = fromISO(s);
  return `${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
};

export const weekdayName = (s: string) => WEEKDAYS[fromISO(s).getDay()];

export const relativeLabel = (s: string, today: string) => {
  const n = diffDays(today, s);
  if (n === 0) return 'hoje';
  if (n === 1) return 'amanhã';
  if (n === -1) return 'ontem';
  if (n > 1 && n < 7) return WEEKDAYS[fromISO(s).getDay()];
  const d = fromISO(s);
  return `${d.getDate()}/${d.getMonth() + 1}`;
};

const ROMAN: [number, string][] = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
export const roman = (n: number) => ROMAN.reduce((acc, [v, r]) => { while (n >= v) { acc += r; n -= v; } return acc; }, '');
