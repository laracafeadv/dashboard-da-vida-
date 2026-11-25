'use client';
import { useEffect, useState } from 'react';
import { longDate, todayISO, weekdayName } from '@/lib/dates';
import { routineFor, tasksFor, useStore, useToast } from '@/lib/store';
import { Frontispiece } from '@/components/hoje/Frontispiece';
import { Brief } from '@/components/hoje/Brief';
import { Priorities, TaskList } from '@/components/hoje/Tasks';
import { Agenda, Goals, Routine } from '@/components/hoje/Context';
import { CloseDay } from '@/components/hoje/CloseDay';

export default function HojePage() {
  const [mounted, setMounted] = useState(false);
  const [today, setToday] = useState('');
  const [selected, setSelected] = useState('');
  const [bumped, setBumped] = useState<string | null>(null);
  const rollover = useStore((s) => s.rollover);
  const tasks = useStore((s) => s.tasks);
  const events = useStore((s) => s.events);
  const routine = useStore((s) => s.routine);
  const toast = useToast((s) => s.show);

  // Ao abrir: leva para hoje o que ficou aberto em dias anteriores.
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
  const isPast = selected < today;
  const dayTasks = tasksFor(tasks, selected);
  const dayEvents = events.filter((e) => e.date === selected);
  const dayRoutine = routineFor(routine, selected);

  const bump = (id: string) => { setBumped(id); setTimeout(() => setBumped(null), 1300); };

  return (
    <>
      <Frontispiece today={today} selected={selected} onSelect={setSelected} />

      {!isToday && (
        <div className="viewing">
          <span>Você está vendo <b>{weekdayName(selected)}, {longDate(selected)}</b>{isPast ? ' (dia passado)' : ' (planejamento)'}.</span>
          <button className="btn-ghost" onClick={() => setSelected(today)}>Voltar para hoje</button>
        </div>
      )}

      <div className="sheet grain">
      <div className="cols">
        <div className="col">
          <Brief tasks={dayTasks} events={dayEvents} routine={dayRoutine} isToday={isToday} />
          <Priorities tasks={dayTasks} />
          <TaskList tasks={dayTasks} today={today} readOnly={!isToday} />
        </div>
        <div className="col">
          <Agenda events={dayEvents} />
          <Routine date={selected} readOnly={selected > today} onGoal={bump} />
          <Goals bumped={bumped} />
        </div>
      </div>

      {!isPast && isToday && <CloseDay date={selected} />}
      </div>
    </>
  );
}
