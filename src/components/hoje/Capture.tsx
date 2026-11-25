'use client';
import { useMemo, useState } from 'react';
import { parseCapture } from '@/lib/parse';
import { relativeLabel } from '@/lib/dates';
import { useStore, useToast } from '@/lib/store';
import { Icon } from '@/components/ui/ornaments';

export function Capture({ today }: { today: string }) {
  const [value, setValue] = useState('');
  const addTask = useStore((s) => s.addTask);
  const toast = useToast((s) => s.show);
  const parsed = useMemo(() => (value.trim() ? parseCapture(value, today) : null), [value, today]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parsed || !parsed.title) return;
    const r = addTask(parsed);
    setValue('');
    if (r.demoted) toast('O dia já tem três prioridades; esta entrou na lista de tarefas.');
    else if (parsed.date !== today) toast(`Anotado para ${relativeLabel(parsed.date, today)}. Aparece sozinho no dia.`);
    else toast('Anotado para hoje.');
  };

  return (
    <form className="card capture" onSubmit={submit} autoComplete="off">
      <label className="eyebrow" htmlFor="capture">Anotar · escreva como falaria</label>
      <div className="capture-row">
        <span className="pen" aria-hidden="true">{Icon.pen}</span>
        <input id="capture" value={value} onChange={(e) => setValue(e.target.value)} placeholder="pagar IPVA sexta 15h #finanças !" />
        <button className="btn" type="submit">Anotar</button>
      </div>
      <div className="parse" aria-live="polite">
        {parsed ? (
          <>
            <span className="pchip">“{parsed.title || '…'}”</span>
            <span className="pchip">{Icon.calendar}{relativeLabel(parsed.date, today)}{parsed.time ? ` · ${parsed.time}` : ''}</span>
            {parsed.area && <span className="pchip">{parsed.area}</span>}
            {parsed.star && <span className="pchip">{Icon.star}prioridade</span>}
            {parsed.waiting && <span className="pchip">{Icon.user}aguardando alguém</span>}
          </>
        ) : (
          <span>
            Entende <code>hoje</code> <code>amanhã</code> <code>sexta</code> <code>dia 10</code> <code>03/12</code> <code>15h</code>{' '}
            <code>#área</code> · <code>!</code> prioridade · <code>@espera</code> aguardando alguém
          </span>
        )}
      </div>
    </form>
  );
}
