'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { MAX_PRIORITIES, useStore, useToast } from '@/lib/store';
import type { Task, TriageAction } from '@/lib/types';
import { Icon } from '@/components/ui/ornaments';
import { Card } from './Card';

const item = {
  initial: { opacity: 0, y: -6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: 24, transition: { duration: 0.2 } },
};

function Check({ task }: { task: Task }) {
  const toggle = useStore((s) => s.toggleTask);
  return (
    <button className="check" role="checkbox" aria-checked={task.done} aria-label={`Concluir: ${task.title}`} onClick={() => toggle(task.id)}>
      {task.done && Icon.check}
    </button>
  );
}

function Meta({ task }: { task: Task }) {
  if (!task.area && !task.waiting && !task.rolled) return null;
  return (
    <div className="row-meta">
      {task.area && <span className="tag">{task.area}</span>}
      {task.waiting && <span className="tag waiting">aguardando alguém</span>}
      {task.rolled > 0 && !task.done && <span className="tag rolled">adiada {task.rolled}×</span>}
    </div>
  );
}

function Triage({ task, today }: { task: Task; today: string }) {
  const triage = useStore((s) => s.triage);
  const stars = useStore((s) => s.tasks.filter((t) => t.date === today && t.star && !t.done && !t.dropped).length);
  const toast = useToast((s) => s.show);
  const act = (a: TriageAction) => {
    if (a === 'hoje' && stars >= MAX_PRIORITIES) { toast('Hoje já tem três prioridades. Conclua ou troque uma antes.'); return; }
    triage(task.id, a, today);
    toast({ hoje: 'Virou prioridade de hoje.', segunda: 'Movida para segunda-feira, sem contar como adiamento.', delegar: 'Marcada como pedido a outra pessoa.', soltar: 'Tarefa solta. Ela aparece na revisão da semana.' }[a]);
  };
  return (
    <div className="triage">
      <p>Adiada {task.rolled} vezes. Mais um adiamento não resolve; o que fazer com ela?</p>
      <div className="opts">
        <button onClick={() => act('hoje')}>Fazer hoje</button>
        <button onClick={() => act('segunda')}>Mover para segunda</button>
        <button onClick={() => act('delegar')}>Pedir a alguém</button>
        <button onClick={() => act('soltar')}>Soltar</button>
      </div>
    </div>
  );
}

export function Priorities({ tasks, readOnly }: { tasks: Task[]; readOnly?: boolean }) {
  const stars = tasks.filter((t) => t.star);
  const done = stars.filter((t) => t.done).length;
  const slots = Array.from({ length: MAX_PRIORITIES - stars.length });
  return (
    <Card title="Três prioridades" meta={`${done} de ${stars.length || 0} feitas`} className="prio">
      <ul className="list">
        <AnimatePresence initial={false}>
          {stars.map((t, i) => (
            <motion.li layout key={t.id} className={`row${t.done ? ' is-done' : ''}`} {...item}>
              <span className="num">{i + 1}</span>
              <div>
                <div className="row-title">{t.title}</div>
                <Meta task={t} />
              </div>
              {!readOnly && <Check task={t} />}
            </motion.li>
          ))}
        </AnimatePresence>
        {slots.map((_, i) => (
          <li key={`slot-${i}`} className="row">
            <span className="num ghost">{stars.length + i + 1}</span>
            <span className="slot">Vaga livre. Toque na estrela de uma tarefa.</span>
            <span />
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function TaskList({ tasks, today, readOnly }: { tasks: Task[]; today: string; readOnly?: boolean }) {
  const toggleStar = useStore((s) => s.toggleStar);
  const toast = useToast((s) => s.show);
  const rest = tasks.filter((t) => !t.star).sort((a, b) => Number(a.done) - Number(b.done) || b.rolled - a.rolled);
  const open = rest.filter((t) => !t.done).length;

  const star = (t: Task) => {
    if (!toggleStar(t.id)) toast('Já há três prioridades. Conclua ou desmarque uma antes.');
  };

  return (
    <Card title={readOnly ? 'Tarefas do dia' : 'Tarefas de hoje'} meta={`${open} ${open === 1 ? 'aberta' : 'abertas'}`}>
      <ul className="list">
        <AnimatePresence initial={false}>
          {rest.map((t) => (
            <motion.li layout key={t.id} className={`row${t.done ? ' is-done' : ''}`} {...item}>
              <Check task={t} />
              <div>
                <div className="row-title">{t.title}</div>
                <Meta task={t} />
              </div>
              {!t.done ? (
                <button className="star" aria-pressed={false} aria-label="Tornar prioridade" onClick={() => star(t)}>{Icon.star}</button>
              ) : <span />}
              {!readOnly && !t.done && t.rolled >= 3 && <Triage task={t} today={today} />}
            </motion.li>
          ))}
        </AnimatePresence>
        {rest.length === 0 && <li className="empty">Nada além das prioridades. Um dia leve.</li>}
      </ul>
    </Card>
  );
}
