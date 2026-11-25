'use client';
import { useEffect, useState } from 'react';
import { addDays, nextMonday, relativeLabel, todayISO } from '@/lib/dates';
import { MAX_PRIORITIES, useStore, useToast } from '@/lib/store';
import { useUI } from '@/lib/ui';
import { Sheet } from '@/components/ui/Sheet';

/** Tudo o que dá para fazer com uma tarefa, em um só lugar. */
export function TaskSheet() {
  const { taskId, closeTask } = useUI();
  const task = useStore((s) => s.tasks.find((t) => t.id === taskId));
  const { toggleTask, updateTask, deleteTask } = useStore();
  const stars = useStore((s) => (task ? s.tasks.filter((t) => t.date === task.date && t.star && !t.done && !t.dropped).length : 0));
  const toast = useToast((s) => s.show);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [picking, setPicking] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const today = todayISO();

  useEffect(() => { setEditing(false); setPicking(false); setConfirm(false); setTitle(task?.title ?? ''); }, [taskId]); // eslint-disable-line react-hooks/exhaustive-deps

  const done = (msg: string) => { toast(msg); closeTask(); };
  const move = (date: string) => { if (!task) return; updateTask(task.id, { date }); done(`Movida para ${relativeLabel(date, today)}.`); };

  return (
    <Sheet open={!!task} onClose={closeTask} title={editing ? 'Editar tarefa' : 'Tarefa'}>
      {task && !editing && (
        <div className="task-sheet">
          <p className="task-sheet-title">{task.title}</p>
          <p className="hint">
            {relativeLabel(task.date, today) === 'hoje' ? 'para hoje' : `para ${relativeLabel(task.date, today)}`}
            {task.waiting ? ' · depende de outra pessoa' : ''}
            {task.rolled > 0 ? ` · já adiada ${task.rolled} ${task.rolled === 1 ? 'vez' : 'vezes'}` : ''}
          </p>
          {task.rolled >= 3 && !task.done && (
            <p className="advice">Ela já foi adiada várias vezes. Vale decidir: fazer hoje como prioridade, marcar outro dia, pedir a alguém ou apagar.</p>
          )}

          <div className="actions">
            <button className="action main" onClick={() => { toggleTask(task.id); done(task.done ? 'Reaberta.' : 'Concluída.'); }}>
              {task.done ? 'Desfazer conclusão' : 'Concluir'}
            </button>
            {!task.done && (
              <button
                className="action"
                onClick={() => {
                  if (!task.star && stars >= MAX_PRIORITIES) { toast('Já há três prioridades nesse dia. Tire uma antes.'); return; }
                  updateTask(task.id, { star: !task.star });
                  done(task.star ? 'Saiu das prioridades.' : 'Agora é prioridade.');
                }}
              >
                {task.star ? 'Tirar das prioridades' : 'Tornar prioridade'}
              </button>
            )}
            {!task.done && (
              <>
                <button className="action" onClick={() => move(addDays(task.date < today ? today : task.date, 1))}>Mover para o dia seguinte</button>
                <button className="action" onClick={() => move(nextMonday(today))}>Mover para segunda</button>
                <button className="action" onClick={() => setPicking(!picking)}>Escolher outro dia</button>
                {picking && <input type="date" aria-label="Novo dia" min={today} onChange={(e) => e.target.value && move(e.target.value)} />}
                <button className="action" onClick={() => { updateTask(task.id, { waiting: !task.waiting }); done(task.waiting ? 'Não depende mais de ninguém.' : 'Marcada como dependendo de outra pessoa.'); }}>
                  {task.waiting ? 'Não depende mais de ninguém' : 'Depende de outra pessoa'}
                </button>
              </>
            )}
            <button className="action" onClick={() => setEditing(true)}>Editar texto</button>
            {confirm ? (
              <p className="confirm">Apagar esta tarefa? <button className="link danger" onClick={() => { deleteTask(task.id); done('Tarefa apagada.'); }}>sim, apagar</button> · <button className="link" onClick={() => setConfirm(false)}>não</button></p>
            ) : (
              <button className="action danger" onClick={() => setConfirm(true)}>Apagar</button>
            )}
          </div>
        </div>
      )}
      {task && editing && (
        <form className="form" onSubmit={(e) => { e.preventDefault(); if (title.trim()) { updateTask(task.id, { title: title.trim() }); done('Tarefa atualizada.'); } }}>
          <label className="field">
            <span>Texto da tarefa</span>
            <textarea rows={3} value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          </label>
          <button className="btn wide" type="submit">Guardar</button>
          <button type="button" className="link" onClick={() => setEditing(false)}>voltar</button>
        </form>
      )}
    </Sheet>
  );
}
