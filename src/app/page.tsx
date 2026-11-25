'use client';
import { useEffect, useState } from 'react';
import { todayISO } from '@/lib/dates';
import { buildBriefing } from '@/lib/briefing';
import { routineFor, tasksFor, useStore, useToast } from '@/lib/store';
import type { Goal } from '@/lib/types';
import { Frontispiece } from '@/components/hoje/Frontispiece';
import { Agenda, DayList, GoalsLine, Priorities } from '@/components/hoje/Day';
import { CloseDay } from '@/components/hoje/CloseDay';

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export default function HojePage() {
  const [mounted, setMounted] = useState(false);
  const [today, setToday] = useState('');
  const [selected, setSelected] = useState('');
  const [bumped, setBumped] = useState<string | null>(null);
  const rollover = useStore((s) => s.rollover);
  const sample = useStore((s) => s.sample);
  const clearSample = useStore((s) => s.clearSample);
  const tasks = useStore((s) => s.tasks);
  const events = useStore((s) => s.events);
  const routine = useStore((s) => s.routine);
  const toast = useToast((s) => s.show);

  // Ao abrir: o que ficou aberto em dias anteriores vem para hoje.
  useEffect(() => {
    const t = todayISO();
    setToday(t);
    setSelected(t);
    setMounted(true);
    const moved = rollover(t);
    if (moved) toast(`${moved} ${moved === 1 ? 'tarefa de dias anteriores veio' : 'tarefas de dias anteriores vieram'} para hoje.`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return <div style={{ minHeight: '100dvh' }} aria-busy="true" />;

  const isToday = selected === today;
  const dayTasks = tasksFor(tasks, selected);
  const dayEvents = events.filter((e) => e.date === selected);
  const dayRoutine = routineFor(routine, selected);
  const brief = buildBriefing(dayTasks, dayEvents, dayRoutine, isToday);

  // Resumo em uma frase.
  const open = dayTasks.filter((t) => !t.done).length + dayRoutine.length;
  const commitments = dayEvents.filter((e) => !e.free).length;
  const stuck = dayTasks.find((t) => !t.done && !t.star && t.rolled >= 3);
  const summary =
    open + commitments === 0
      ? 'Dia livre por enquanto.'
      : `${commitments ? `${plural(commitments, 'compromisso', 'compromissos')} e ` : ''}${plural(open, 'coisa para fazer', 'coisas para fazer')}.` +
        (stuck && isToday ? ` “${stuck.title}” pede uma decisão.` : '');

  const bump = (g: Goal) => { setBumped(g.id); setTimeout(() => setBumped(null), 1300); };

  return (
    <article className="day">
      <Frontispiece today={today} selected={selected} onSelect={setSelected} summary={summary} />
      {sample && (
        <aside className="sample-note">
          <p>Estas tarefas, rotina e metas são <b>exemplos</b> para você conhecer o Diário.</p>
          <button className="pill-btn" onClick={() => { clearSample(); toast('Pronto. Agora é só adicionar as suas coisas pelo botão +.'); }}>apagar exemplos e começar</button>
        </aside>
      )}
      <Priorities tasks={dayTasks} suggestion={brief.suggestion} readOnly={!isToday} />
      <Agenda events={dayEvents} />
      <DayList date={selected} today={today} tasks={dayTasks} onGoal={bump} />
      <GoalsLine bumped={bumped} />
      {isToday && <CloseDay date={selected} />}
    </article>
  );
}
