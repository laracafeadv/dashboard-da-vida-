'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { MAX_PRIORITIES, routineFor, routineKey, useStore, useToast } from '@/lib/store';
import type { CalendarEvent, Goal, Task, TriageAction } from '@/lib/types';
import { MixTitle } from './Title';

const enter = {
  initial: { opacity: 0, y: -4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="section">
      <h2 className="section-title"><MixTitle text={title} /></h2>
      {note && <p className="section-note">{note}</p>}
      {children}
    </section>
  );
}

function Check({ checked, label, onClick, disabled }: { checked: boolean; label: string; onClick: () => void; disabled?: boolean }) {
  return <button className="check" role="checkbox" aria-checked={checked} aria-label={label} onClick={onClick} disabled={disabled} />;
}

/* ---------------- prioridades ---------------- */
export function Priorities({ tasks, suggestion, readOnly }: { tasks: Task[]; suggestion?: Task; readOnly?: boolean }) {
  const toggle = useStore((s) => s.toggleTask);
  const toggleStar = useStore((s) => s.toggleStar);
  const toast = useToast((s) => s.show);
  const stars = tasks.filter((t) => t.star);
  const free = MAX_PRIORITIES - stars.length;

  return (
    <Section title="Três prioridades">
      <ol className="prio">
        <AnimatePresence initial={false}>
          {stars.map((t, i) => (
            <motion.li key={t.id} className={t.done ? 'is-done' : ''} {...enter}>
              <span className="num">{i + 1}</span>
              <span className="text">{t.title}</span>
              {!readOnly && <Check checked={t.done} label={`Concluir: ${t.title}`} onClick={() => toggle(t.id)} />}
            </motion.li>
          ))}
        </AnimatePresence>
        {free > 0 && (
          <li className="slot">
            <span className="num">{stars.length + 1}</span>
            {suggestion && !readOnly ? (
              <span className="text">
                Sugestão: {suggestion.title}.{' '}
                <button className="link" onClick={() => { if (toggleStar(suggestion.id)) toast('Virou prioridade.'); }}>priorizar</button>
              </span>
            ) : (
              <span className="text">Escolha na lista abaixo, tocando na estrela.</span>
            )}
          </li>
        )}
      </ol>
    </Section>
  );
}

/* ---------------- agenda ---------------- */
export function Agenda({ events }: { events: CalendarEvent[] }) {
  const sorted = [...events].sort((a, b) => a.start.localeCompare(b.start));
  return (
    <Section title="Agenda" note="exemplo · ligação com o Google Agenda em breve">
      {sorted.length === 0 ? (
        <p className="empty">Nenhum compromisso.</p>
      ) : (
        <ul className="agenda">
          {sorted.map((e) => (
            <li key={e.id} className={e.free ? 'free' : ''}>
              <time className="tabular">{e.start}</time>
              <span>{e.free ? 'livre, de propósito' : e.title}{e.place && !e.free ? <em> · {e.place}</em> : null}</span>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

/* ---------------- lista do dia: tarefas + rotina ---------------- */
const fmt = (g: Goal, v: number) => (g.unit === 'R$' ? `R$ ${v.toLocaleString('pt-BR')}` : `${v}${g.unit ? ` ${g.unit}` : ''}`);

function Triage({ task, today }: { task: Task; today: string }) {
  const triage = useStore((s) => s.triage);
  const stars = useStore((s) => s.tasks.filter((t) => t.date === today && t.star && !t.done && !t.dropped).length);
  const toast = useToast((s) => s.show);
  const act = (a: TriageAction) => {
    if (a === 'hoje' && stars >= MAX_PRIORITIES) { toast('Hoje já tem três prioridades.'); return; }
    triage(task.id, a, today);
    toast({ hoje: 'Virou prioridade de hoje.', segunda: 'Movida para segunda-feira.', delegar: 'Marcada como pedido a outra pessoa.', soltar: 'Tarefa solta.' }[a]);
  };
  return (
    <p className="triage">
      adiada {task.rolled} vezes —{' '}
      <button className="link" onClick={() => act('hoje')}>fazer hoje</button>,{' '}
      <button className="link" onClick={() => act('segunda')}>segunda</button>,{' '}
      <button className="link" onClick={() => act('delegar')}>pedir a alguém</button> ou{' '}
      <button className="link" onClick={() => act('soltar')}>soltar</button>
    </p>
  );
}

export function DayList({ date, today, tasks, onGoal }: { date: string; today: string; tasks: Task[]; onGoal: (g: Goal) => void }) {
  const routine = useStore((s) => s.routine);
  const routineDone = useStore((s) => s.routineDone);
  const goals = useStore((s) => s.goals);
  const toggleRoutine = useStore((s) => s.toggleRoutine);
  const toggleTask = useStore((s) => s.toggleTask);
  const toggleStar = useStore((s) => s.toggleStar);
  const toast = useToast((s) => s.show);
  const isToday = date === today;
  const future = date > today;

  const rest = tasks.filter((t) => !t.star).sort((a, b) => Number(a.done) - Number(b.done) || b.rolled - a.rolled);
  const items = routineFor(routine, date);
  const open = rest.filter((t) => !t.done).length + items.filter((r) => !routineDone[routineKey(date, r.id)]).length;

  const star = (t: Task) => { if (!toggleStar(t.id)) toast('Já há três prioridades.'); };
  const doRoutine = (id: string) => {
    const g = toggleRoutine(date, id);
    if (g) { onGoal(g); toast(`${g.title}: ${fmt(g, g.current)} de ${fmt(g, g.target)}.`); }
  };

  return (
    <Section title="Para fazer" note={`${open} em aberto`}>
      <ul className="list">
        <AnimatePresence initial={false}>
          {rest.map((t) => (
            <motion.li key={t.id} className={t.done ? 'is-done' : ''} {...enter}>
              <Check checked={t.done} label={`Concluir: ${t.title}`} onClick={() => toggleTask(t.id)} disabled={future} />
              <div className="body">
                <span className="text">{t.title}</span>
                {(t.waiting || (t.rolled > 0 && t.rolled < 3)) && !t.done && (
                  <span className="meta">{t.waiting ? 'aguardando alguém' : `adiada ${t.rolled}×`}</span>
                )}
                {isToday && !t.done && t.rolled >= 3 && <Triage task={t} today={today} />}
              </div>
              {!t.done && <button className="star" aria-label="Tornar prioridade" onClick={() => star(t)}>☆</button>}
            </motion.li>
          ))}
        </AnimatePresence>
        {items.map((r) => {
          const done = !!routineDone[routineKey(date, r.id)];
          const goal = goals.find((g) => g.id === r.goalId);
          return (
            <li key={r.id} className={done ? 'is-done' : ''}>
              <Check checked={done} label={`Concluir: ${r.title}`} onClick={() => doRoutine(r.id)} disabled={future} />
              <div className="body">
                <span className="text">{r.title}</span>
                <span className="meta">rotina{goal ? ` · conta para “${goal.title}”` : ''}</span>
              </div>
            </li>
          );
        })}
        {rest.length + items.length === 0 && <li className="empty">Nada para este dia.</li>}
      </ul>
    </Section>
  );
}

/* ---------------- metas: uma linha ---------------- */
export function GoalsLine({ bumped }: { bumped: string | null }) {
  const goals = useStore((s) => s.goals);
  return (
    <p className="goals-line">
      <span className="label">Metas do mês</span>
      {goals.map((g) => (
        <span key={g.id} className={`goal${bumped === g.id ? ' bump' : ''}`}>
          {g.title.replace(/^Reserva de emergência$/, 'Reserva')} <b className="tabular">{Math.min(100, Math.round((g.current / g.target) * 100))}%</b>
        </span>
      ))}
    </p>
  );
}
