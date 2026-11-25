export type Direction = 'gabinete' | 'almanaque' | 'deco';

export interface Task {
  id: string;
  title: string;
  /** Dia em que a tarefa aparece (AAAA-MM-DD). */
  date: string;
  time?: string;
  area?: string;
  star: boolean;
  done: boolean;
  doneAt?: string;
  /** Quantas vezes a tarefa foi empurrada para outro dia. */
  rolled: number;
  /** Depende de outra pessoa. */
  waiting: boolean;
  dropped: boolean;
  createdAt: string;
}

export interface RoutineItem {
  id: string;
  title: string;
  /** Texto legível da recorrência. */
  when: string;
  /** Dias da semana (0 = domingo). */
  days?: number[];
  /** Dia fixo do mês. */
  monthDay?: number;
  goalId?: string;
  /** Quanto cada conclusão soma na meta (padrão 1). */
  increment?: number;
}

export interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit?: string;
  area?: string;
}

export interface CalendarEvent {
  id: string;
  date: string;
  start: string;
  end?: string;
  title: string;
  place?: string;
  free?: boolean;
}

export interface DayClose {
  date: string;
  line: string;
  completed: number;
  moved: number;
  closedAt: string;
}

export type CloseChoice = 'amanha' | 'semana' | 'soltar';
export type TriageAction = 'hoje' | 'segunda' | 'delegar' | 'soltar';
