'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addDays, diffDays, fromISO, nextMonday, todayISO } from './dates';
import type { ParsedCapture } from './parse';
import { sampleData } from './sample';
import type { CalendarEvent, CloseChoice, DayClose, Goal, Note, RoutineItem, Task, TriageAction } from './types';

const uid = () => Math.random().toString(36).slice(2, 10);
export const MAX_PRIORITIES = 3;

interface State {
  tasks: Task[];
  goals: Goal[];
  routine: RoutineItem[];
  routineDone: Record<string, boolean>;
  events: CalendarEvent[];
  closes: Record<string, DayClose>;
  focos: string[];
  lastSeen: string;
  notes: Note[];
  /** Verdadeiro enquanto os dados de exemplo não foram apagados. */
  sample: boolean;

  /** Leva para hoje o que ficou aberto em dias anteriores. Retorna quantas tarefas migraram. */
  rollover: (today: string) => number;
  addTask: (p: ParsedCapture) => { ok: boolean; demoted: boolean };
  toggleTask: (id: string) => void;
  updateTask: (id: string, patch: Partial<Pick<Task, 'title' | 'date' | 'star' | 'waiting'>>) => void;
  deleteTask: (id: string) => void;
  /** Apaga os exemplos (tarefas, rotina, metas, agenda) e começa do zero. Mantém o Caderno. */
  clearSample: () => void;
  toggleStar: (id: string) => boolean;
  triage: (id: string, action: TriageAction, today: string) => void;
  toggleRoutine: (date: string, routineId: string) => Goal | undefined;
  closeDay: (date: string, choices: Record<string, CloseChoice>, line: string) => DayClose;
  reopenDay: (date: string) => void;
  resetSample: () => void;
  addNote: (n: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'versions'>) => string;
  /** Atualiza a nota; se o texto mudou, o texto anterior vira uma versão. */
  updateNote: (id: string, patch: Partial<Omit<Note, 'id' | 'createdAt' | 'versions'>>) => void;
  deleteNote: (id: string) => void;
}

export const routineKey = (date: string, id: string) => `${date}:${id}`;

export const routineFor = (routine: RoutineItem[], date: string) => {
  const d = fromISO(date);
  return routine.filter((r) => (r.monthDay ? r.monthDay === d.getDate() : r.days?.includes(d.getDay())));
};

export const tasksFor = (tasks: Task[], date: string) => tasks.filter((t) => t.date === date && !t.dropped);

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      ...sampleData(todayISO()),
      routineDone: {},
      closes: {},
      lastSeen: todayISO(),
      notes: [],
      sample: true,

      rollover: (today) => {
        let moved = 0;
        const tasks = get().tasks.map((t) => {
          if (!t.done && !t.dropped && t.date < today) {
            moved++;
            return { ...t, date: today, rolled: t.rolled + 1 };
          }
          return t;
        });
        // Concluídas há mais de 30 dias saem da lista ativa.
        const kept = tasks.filter((t) => !(t.done && t.date < today && diffDays(t.date, today) > 30));
        set({ tasks: kept, lastSeen: today });
        return moved;
      },

      addTask: (p) => {
        const sameDayStars = get().tasks.filter((t) => t.date === p.date && t.star && !t.done && !t.dropped).length;
        const demoted = p.star && sameDayStars >= MAX_PRIORITIES;
        const task: Task = {
          id: uid(), title: p.title + (p.time ? ` — ${p.time}` : ''), date: p.date, time: p.time, area: p.area,
          star: p.star && !demoted, done: false, rolled: 0, waiting: p.waiting, dropped: false, createdAt: new Date().toISOString(),
        };
        set({ tasks: [...get().tasks, task] });
        return { ok: true, demoted };
      },

      updateTask: (id, patch) => {
        const t = get().tasks.find((x) => x.id === id);
        if (!t) return;
        // Mudar a data por escolha própria não conta como adiamento.
        const moved = patch.date !== undefined && patch.date !== t.date;
        set({ tasks: get().tasks.map((x) => (x.id === id ? { ...x, ...patch, rolled: moved ? 0 : x.rolled, star: moved ? false : patch.star ?? x.star } : x)) });
      },

      deleteTask: (id) => set({ tasks: get().tasks.filter((t) => t.id !== id) }),

      clearSample: () => set({ tasks: [], routine: [], goals: [], events: [], routineDone: {}, closes: {}, focos: [], sample: false }),

      toggleTask: (id) =>
        set({ tasks: get().tasks.map((t) => (t.id === id ? { ...t, done: !t.done, doneAt: !t.done ? new Date().toISOString() : undefined } : t)) }),

      toggleStar: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return false;
        if (!task.star) {
          const count = get().tasks.filter((t) => t.date === task.date && t.star && !t.done && !t.dropped).length;
          if (count >= MAX_PRIORITIES) return false;
        }
        set({ tasks: get().tasks.map((t) => (t.id === id ? { ...t, star: !t.star } : t)) });
        return true;
      },

      triage: (id, action, today) =>
        set({
          tasks: get().tasks.map((t) => {
            if (t.id !== id) return t;
            if (action === 'hoje') return { ...t, star: true, rolled: 0, date: today };
            if (action === 'segunda') return { ...t, date: nextMonday(today), rolled: 0, star: false };
            if (action === 'delegar') {
              const title = /^pedir/i.test(t.title) ? t.title : `Pedir a alguém: ${t.title.charAt(0).toLowerCase()}${t.title.slice(1)}`;
              return { ...t, title, waiting: true, rolled: 0 };
            }
            return { ...t, dropped: true };
          }),
        }),

      toggleRoutine: (date, routineId) => {
        const key = routineKey(date, routineId);
        const wasDone = !!get().routineDone[key];
        const item = get().routine.find((r) => r.id === routineId);
        let updated: Goal | undefined;
        const goals = get().goals.map((g) => {
          if (!item?.goalId || g.id !== item.goalId) return g;
          updated = { ...g, current: Math.max(0, g.current + (wasDone ? -1 : 1) * (item.increment ?? 1)) };
          return updated;
        });
        set({ routineDone: { ...get().routineDone, [key]: !wasDone }, goals });
        return wasDone ? undefined : updated;
      },

      closeDay: (date, choices, line) => {
        const tomorrow = addDays(date, 1);
        let moved = 0;
        const tasks = get().tasks.map((t) => {
          const c = choices[t.id];
          if (t.waiting && !t.done && !t.dropped && t.date === date) return { ...t, date: tomorrow };
          if (!c) return t;
          if (c === 'amanha') { moved++; return { ...t, date: tomorrow, rolled: t.rolled + 1 }; }
          if (c === 'semana') return { ...t, date: nextMonday(date), star: false };
          return { ...t, dropped: true };
        });
        const completed =
          get().tasks.filter((t) => t.date === date && t.done).length +
          routineFor(get().routine, date).filter((r) => get().routineDone[routineKey(date, r.id)]).length;
        const close: DayClose = { date, line, completed, moved, closedAt: new Date().toISOString() };
        set({ tasks, closes: { ...get().closes, [date]: close } });
        return close;
      },

      reopenDay: (date) => {
        const closes = { ...get().closes };
        delete closes[date];
        set({ closes });
      },

      addNote: (n) => {
        const now = new Date().toISOString();
        const note: Note = { ...n, id: uid(), createdAt: now, updatedAt: now, versions: [] };
        set({ notes: [note, ...get().notes] });
        return note.id;
      },

      updateNote: (id, patch) =>
        set({
          notes: get().notes.map((n) => {
            if (n.id !== id) return n;
            const changedBody = patch.body !== undefined && patch.body !== n.body;
            return {
              ...n,
              ...patch,
              updatedAt: new Date().toISOString(),
              versions: changedBody ? [{ at: n.updatedAt, body: n.body }, ...n.versions].slice(0, 30) : n.versions,
            };
          }),
        }),

      deleteNote: (id) => set({ notes: get().notes.filter((n) => n.id !== id) }),

      resetSample: () => {
        const today = todayISO();
        set({ ...sampleData(today), routineDone: {}, closes: {}, lastSeen: today });
      },
    }),
    { name: 'diario-da-vida', version: 2, migrate: (s) => s as State },
  ),
);

/** Mensagens rápidas de confirmação (não persistem). */
interface ToastState { message: string | null; key: number; show: (m: string) => void; hide: () => void }
export const useToast = create<ToastState>((set) => ({
  message: null,
  key: 0,
  show: (message) => set((s) => ({ message, key: s.key + 1 })),
  hide: () => set({ message: null }),
}));
