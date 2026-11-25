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

/* ---------- Caderno ---------- */
export type NoteKind = 'pensamento' | 'referencia';

export interface NoteImage {
  id: string;
  /** Imagem comprimida em data URL (modo só no aparelho) ou caminho no armazenamento da nuvem. */
  src: string;
  cloud?: boolean;
  w: number;
  h: number;
}

export interface NoteVersion {
  at: string;
  body: string;
}

export interface Note {
  id: string;
  kind: NoteKind;
  title: string;
  body: string;
  images: NoteImage[];
  temas: string[];
  pasta?: string;
  createdAt: string;
  updatedAt: string;
  /** Textos anteriores, do mais recente ao mais antigo. */
  versions: NoteVersion[];
}
