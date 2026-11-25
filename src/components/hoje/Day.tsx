'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { MAX_PRIORITIES, routineFor, routineKey, useStore, useToast } from '@/lib/store';
import { useUI } from '@/lib/ui';
import type { CalendarEvent, Goal, Task } from '@/lib/types';
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

const fmt = (g: Goal, v: number) => (g.unit === 'R$' ? `R$ ${v.toLocaleString('pt-BR')}` : `${v}${g.unit ? ` ${g.unit}` : ''}`);

/* ---------------- prioridades ---------------- */
export function Priorities({ tasks, suggestion, readOnly }: { tasks: Task[]; suggestion?: Task; readOnly?: boolean }) {
  const toggle = useStore((s) => s.toggleTask);
  const toggleStar = useStore((s) => s.toggleStar);
  const openTask = useUI((s) => s.openTask);
  const toast = useToast((s) => s.show);
  const stars = tasks.filter((t) => t.star);
  const free = MAX_PRIORITIES - stars.length;

  return (
    <Section title="Três prioridades" note="O que mais importa hoje. O resto é bônus.">
      <ol className="prio">
        <AnimatePresence initial={false}>
          {stars.map((t, i) => (
            <motion.li key={t.id} className={t.done ? 'is-done' : ''} {...enter}>
              <span className="num">{i + 1}</span>
              <button className="text tap" onClick={() => openTask(t.id)}>{t.title}</button>
              {!readOnly && <Check checked={t.done} label={`Concluir: ${t.title}`} onClick={() => toggle(t.id)} />}
            </motion.li>
          ))}
        </AnimatePresence>
        {free > 0 && (
          <li className="slot">
            <span className="num">{stars.length + 1}</span>
            {suggestion && !readOnly ? (
              <span className="text">
                Sugestão: <b>{suggestion.title}</b>{' '}
                <button className="pill-btn" onClick={() => { if (toggleStar(suggestion.id)) toast('Agora é prioridade.'); }}>tornar prioridade</button>
              </span>
            ) : (
              <span className="text">
                {tasks.length === 0
                  ? 'Vaga livre. Adicione uma tarefa pelo + e marque “É uma das três prioridades de hoje”.'
                  : 'Vaga livre. Toque numa tarefa da lista e escolha “Tornar prioridade”.'}
              </span>
            )}
          </li>
        )}
      </ol>
    </Section>
  );
}

/* ---------------- agenda ---------------- */
export function Agenda({ events }: { events: CalendarEvent[] }) {
  if (events.length === 0) return null;
  const sorted = [...events].sort((a, b) => a.start.localeCompare(b.start));
  return (
    <Section title="Agenda" note="Compromissos do dia (exemplo; a ligação com o Google Agenda vem depois).">
      <ul className="agenda">
        {sorted.map((e) => (
          <li key={e.id} className={e.free ? 'free' : ''}>
            <time className="tabular">{e.start}</time>
            <span>{e.free ? 'livre, de propósito' : e.title}{e.place && !e.free ? <em> · {e.place}</em> : null}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ---------------- lista do dia: tarefas + rotina ---------------- */
export function DayList({ date, today, tasks, onGoal }: { date: string; today: string; tasks: Task[]; onGoal: (g: Goal) => void }) {
  const routine = useStore((s) => s.routine);
  const routineDone = useStore((s) => s.routineDone);
  const goals = useStore((s) => s.goals);
  const toggleRoutine = useStore((s) => s.toggleRoutine);
  const toggleTask = useStore((s) => s.toggleTask);
  const openTask = useUI((s) => s.openTask);
  const openAdd = useUI((s) => s.openAdd);
  const toast = useToast((s) => s.show);
  const future = date > today;

  const rest = tasks.filter((t) => !t.star).sort((a, b) => Number(a.done) - Number(b.done) || b.rolled - a.rolled);
  const items = routineFor(routine, date);
  const open = rest.filter((t) => !t.done).length + items.filter((r) => !routineDone[routineKey(date, r.id)]).length;

  const doRoutine = (id: string) => {
    const g = toggleRoutine(date, id);
    if (g) { onGoal(g); toast(`${g.title}: ${fmt(g, g.current)} de ${fmt(g, g.target)}.`); }
  };

  return (
    <Section title="Para fazer" note={rest.length + items.length ? `${open} em aberto · toque numa tarefa para ver as opções` : undefined}>
      {rest.length + items.length === 0 ? (
        <div className="empty-block">
          <p>Nada para este dia.</p>
          <button className="pill-btn" onClick={() => openAdd('tarefa')}>adicionar tarefa</button>
        </div>
      ) : (
        <ul className="list">
          <AnimatePresence initial={false}>
            {rest.map((t) => (
              <motion.li key={t.id} className={t.done ? 'is-done' : ''} {...enter}>
                <Check checked={t.done} label={`Concluir: ${t.title}`} onClick={() => toggleTask(t.id)} disabled={future} />
                <button className="body tap" onClick={() => openTask(t.id)}>
                  <span className="text">{t.title}</span>
                  {!t.done && t.rolled >= 3 && <span className="meta warn">adiada {t.rolled} vezes — toque para decidir</span>}
                  {!t.done && t.rolled > 0 && t.rolled < 3 && <span className="meta">adiada {t.rolled}×</span>}
                  {!t.done && t.waiting && <span className="meta">depende de outra pessoa</span>}
                </button>
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
        </ul>
      )}
    </Section>
  );
}

/* ---------------- metas: uma linha ---------------- */
export function GoalsLine({ bumped }: { bumped: string | null }) {
  const goals = useStore((s) => s.goals);
  if (goals.length === 0) return null;
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
