'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { routineFor, routineKey, tasksFor, useStore, useToast } from '@/lib/store';
import type { CloseChoice } from '@/lib/types';
import { WaxSeal } from '@/components/ui/vintage';

const LABEL: Record<CloseChoice, string> = { amanha: 'Amanhã', semana: 'Segunda que vem', soltar: 'Soltar' };

export function CloseDay({ date }: { date: string }) {
  const [open, setOpen] = useState(false);
  const [choices, setChoices] = useState<Record<string, CloseChoice>>({});
  const [line, setLine] = useState('');
  const store = useStore();
  const toast = useToast((s) => s.show);
  const closed = store.closes[date];

  const dayTasks = tasksFor(store.tasks, date);
  const pending = dayTasks.filter((t) => !t.done && !t.waiting);
  const doneCount = dayTasks.filter((t) => t.done).length + routineFor(store.routine, date).filter((r) => store.routineDone[routineKey(date, r.id)]).length;
  const prioDone = dayTasks.filter((t) => t.star && t.done).length;

  useEffect(() => {
    if (!open) return;
    setChoices(Object.fromEntries(pending.map((t) => [t.id, 'amanha' as CloseChoice])));
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const confirm = () => {
    const c = store.closeDay(date, choices, line.trim());
    setOpen(false);
    setLine('');
    toast(`Dia lacrado. ${c.moved} ${c.moved === 1 ? 'tarefa seguiu' : 'tarefas seguiram'} para amanhã.`);
  };

  return (
    <>
      <section className="note close-note">
        <WaxSeal id="close-seal" className={`close-seal${closed ? ' is-sealed' : ''}`} />
        <div className="card-head">
          <h2 className="card-title">{closed ? 'Dia lacrado' : 'Fechar o dia'}</h2>
          <span className="card-meta">{closed ? `${closed.completed} concluídos · ${closed.moved} para amanhã` : 'um minuto, à noite'}</span>
        </div>
        {closed ? (
          <>
            {closed.line ? <p className="script close-line">{closed.line}</p> : <p className="close-text">Sem anotação para hoje.</p>}
            <button className="btn-ghost" onClick={() => store.reopenDay(date)}>Reabrir o dia</button>
          </>
        ) : (
          <>
            <p className="close-text">Decida o destino do que ficou aberto e deixe uma linha para a revisão da semana. O que você não decidir vai sozinho para amanhã.</p>
            <button className="btn" onClick={() => setOpen(true)}>Fechar e lacrar</button>
          </>
        )}
      </section>

      <AnimatePresence>
        {open && (
          <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
            <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }} role="dialog" aria-modal="true" aria-label="Fechar o dia" className="note dialog">
              <WaxSeal id="dialog-seal" className="close-seal" />
              <div className="card-head">
                <h2 className="card-title">Fechar o dia</h2>
                <span className="card-meta">um minuto</span>
              </div>
              <div className="tally">
                <div><b className="tabular">{doneCount}</b><span>concluídos</span></div>
                <div><b className="tabular">{prioDone}/3</b><span>prioridades</span></div>
                <div><b className="tabular">{pending.length}</b><span>em aberto</span></div>
              </div>
              {pending.length > 0 ? (
                <ul className="list">
                  {pending.map((t) => (
                    <li key={t.id} className="dest">
                      <span className="row-title">{t.title}</span>
                      <div className="seg" role="group" aria-label={`Destino de ${t.title}`}>
                        {(Object.keys(LABEL) as CloseChoice[]).map((c) => (
                          <button key={c} type="button" aria-pressed={choices[t.id] === c} onClick={() => setChoices({ ...choices, [t.id]: c })}>{LABEL[c]}</button>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty">Nada ficou pendente. Bom dia de trabalho.</p>
              )}
              <label htmlFor="linha">Uma linha sobre hoje</label>
              <textarea id="linha" value={line} onChange={(e) => setLine(e.target.value)} placeholder="A audiência rendeu; amanhã, uma pausa de verdade." />
              <div className="acts">
                <button className="btn-ghost" onClick={() => setOpen(false)}>Voltar</button>
                <button className="btn" onClick={confirm}>Lacrar o dia</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
