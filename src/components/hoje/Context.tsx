'use client';
import { useState } from 'react';
import { routineFor, routineKey, useStore, useToast } from '@/lib/store';
import type { CalendarEvent, Goal } from '@/lib/types';
import { Icon } from '@/components/ui/ornaments';
import { Card } from './Card';

export function Agenda({ events }: { events: CalendarEvent[] }) {
  const sorted = [...events].sort((a, b) => a.start.localeCompare(b.start));
  return (
    <Card title="Agenda" meta="exemplo · Google Agenda em breve">
      {sorted.length === 0 ? (
        <p className="empty">Nenhum compromisso. Dia aberto.</p>
      ) : (
        <div className="agenda">
          {sorted.map((e) => (
            <div key={e.id} className={`ev${e.free ? ' free' : ''}`}>
              <time className="tabular">{e.start}</time>
              <span className="pin" aria-hidden="true" />
              <div className="body">
                <b>{e.free ? 'Espaço livre, mantido de propósito' : e.title}</b>
                <span>{[e.end && `até ${e.end}`, e.place].filter(Boolean).join(' · ')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

const fmt = (g: Goal, v: number) => (g.unit === 'R$' ? `R$ ${v.toLocaleString('pt-BR')}` : `${v}${g.unit ? ` ${g.unit}` : ''}`);

export function Routine({ date, readOnly, onGoal }: { date: string; readOnly?: boolean; onGoal: (id: string) => void }) {
  const routine = useStore((s) => s.routine);
  const done = useStore((s) => s.routineDone);
  const goals = useStore((s) => s.goals);
  const toggle = useStore((s) => s.toggleRoutine);
  const toast = useToast((s) => s.show);
  const items = routineFor(routine, date);
  const count = items.filter((r) => done[routineKey(date, r.id)]).length;

  const click = (id: string) => {
    const g = toggle(date, id);
    if (g) { onGoal(g.id); toast(`“${g.title}” avançou: ${fmt(g, g.current)} de ${fmt(g, g.target)}.`); }
  };

  return (
    <Card title="Rotina do dia" meta="gerada pela sua rotina" className="rot">
      <ul className="list">
        {items.map((r) => {
          const isDone = !!done[routineKey(date, r.id)];
          const goal = goals.find((g) => g.id === r.goalId);
          return (
            <li key={r.id} className={`row${isDone ? ' is-done' : ''}`}>
              <button className="check" role="checkbox" aria-checked={isDone} aria-label={`Concluir: ${r.title}`} disabled={readOnly} onClick={() => click(r.id)}>
                
              </button>
              <div>
                <div className="row-title">{r.title}</div>
                <div className="row-link">{r.when}{goal && <> · alimenta <b>{goal.title}</b></>}</div>
              </div>
              <span />
            </li>
          );
        })}
        {items.length === 0 && <li className="empty">Sem rotina para este dia.</li>}
      </ul>
      {items.length > 0 && <p className="row-link" style={{ marginTop: 10 }}>{count} de {items.length} feitos</p>}
    </Card>
  );
}

export function Goals({ bumped }: { bumped: string | null }) {
  const goals = useStore((s) => s.goals);
  const [now] = useState(() => new Date());
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const expected = Math.round((now.getDate() / daysInMonth) * 100);
  return (
    <Card title="Metas do mês" meta="atualizam sozinhas">
      {goals.map((g) => {
        const pct = Math.min(100, Math.round((g.current / g.target) * 100));
        const status = pct >= expected ? 'no ritmo' : pct >= expected - 15 ? 'um pouco atrás' : 'atrasada';
        return (
          <div key={g.id} className={`goal${bumped === g.id ? ' bump' : ''}`}>
            <div className="goal-top"><b>{g.title}</b><span className="tabular">{fmt(g, g.current)} / {fmt(g, g.target)}</span></div>
            <div className="meter" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={g.title}>
              <i style={{ width: `${pct}%`, transition: 'width .6s ease' }} />
              <span className="ticks" />
            </div>
            <div className="goal-foot"><span>{pct}%</span><span>{status} · esperado {expected}% hoje</span></div>
          </div>
        );
      })}
    </Card>
  );
}
