import { addDays, nextWeekday } from './dates';
import type { CalendarEvent, Goal, RoutineItem, Task } from './types';

const id = () => Math.random().toString(36).slice(2, 10);

/** Dados de exemplo, relativos à data de hoje, para a primeira abertura. */
export function sampleData(today: string) {
  const now = new Date().toISOString();
  const t = (title: string, extra: Partial<Task> = {}): Task => ({
    id: id(), title, date: today, star: false, done: false, rolled: 0, waiting: false, dropped: false, createdAt: now, ...extra,
  });

  const tasks: Task[] = [
    t('Finalizar parecer — Cliente Almeida', { area: 'Carreira', star: true, rolled: 1 }),
    t('Fechar orçamento de dezembro', { area: 'Finanças', star: true }),
    t('Marcar consulta com a dermatologista', { area: 'Saúde', rolled: 3 }),
    t('Retorno do contador sobre o IR', { area: 'Finanças', waiting: true }),
    t('Enviar minuta revisada', { area: 'Carreira', done: true, doneAt: now }),
    t('Ligar para a vovó', { area: 'Família' }),
    t('Comprar presente de aniversário da Ju', { area: 'Pessoal', date: addDays(today, 2) }),
    t('Renovar seguro do carro', { area: 'Finanças', date: nextWeekday(today, 1) }),
  ];

  const goals: Goal[] = [
    { id: 'g-treino', title: 'Treinar 12 vezes', current: 8, target: 12, area: 'Saúde' },
    { id: 'g-reserva', title: 'Reserva de emergência', current: 1200, target: 2000, unit: 'R$', area: 'Finanças' },
    { id: 'g-leitura', title: 'Ler 300 páginas', current: 180, target: 300, unit: 'pág.', area: 'Estudos' },
  ];

  const routine: RoutineItem[] = [
    { id: 'r-treino', title: 'Treino funcional — 30 min', when: 'seg, qua e sex', days: [1, 3, 5], goalId: 'g-treino' },
    { id: 'r-leitura', title: 'Ler 20 páginas', when: 'todo dia', days: [0, 1, 2, 3, 4, 5, 6], goalId: 'g-leitura', increment: 20 },
    { id: 'r-plan', title: 'Planejar o dia seguinte', when: 'dias úteis', days: [1, 2, 3, 4, 5] },
    { id: 'r-gastos', title: 'Registrar gastos do dia', when: 'todo dia', days: [0, 1, 2, 3, 4, 5, 6] },
    { id: 'r-cartao', title: 'Pagar fatura do cartão', when: 'todo dia 10', monthDay: 10 },
    { id: 'r-casa', title: 'Faxina leve e roupa', when: 'sábados', days: [6] },
  ];

  const ev = (date: string, start: string, title: string, extra: Partial<CalendarEvent> = {}): CalendarEvent => ({ id: id(), date, start, title, ...extra });
  const events: CalendarEvent[] = [
    ev(today, '09:00', 'Audiência de conciliação', { end: '10:30', place: 'Fórum central' }),
    ev(today, '11:00', 'Bloco de foco', { end: '13:00', place: 'Parecer Almeida' }),
    ev(today, '14:00', 'Espaço livre', { end: '15:30', free: true }),
    ev(today, '17:30', 'Reunião com a equipe', { end: '18:15', place: 'online' }),
    ev(addDays(today, 1), '10:00', 'Cliente novo — primeira conversa', { end: '11:00' }),
    ev(addDays(today, 2), '19:30', 'Jantar de aniversário da Ju'),
  ];

  return { tasks, goals, routine, events, focos: ['Saúde', 'Carreira', 'Finanças'] };
}
