'use client';
import { useMemo, useState } from 'react';
import { parseCapture } from '@/lib/parse';
import { relativeLabel } from '@/lib/dates';
import { useStore, useToast } from '@/lib/store';

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
    <form className="capture" onSubmit={submit} autoComplete="off">
      <label htmlFor="capture" className="sr-only">Anotar</label>
      <input id="capture" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Anotar algo… ex.: pagar IPVA sexta 15h" />
      <p className="parse" aria-live="polite">
        {parsed
          ? <>{parsed.title || '…'} · {relativeLabel(parsed.date, today)}{parsed.time ? ` às ${parsed.time}` : ''}{parsed.area ? ` · ${parsed.area}` : ''}{parsed.star ? ' · prioridade' : ''}{parsed.waiting ? ' · aguardando alguém' : ''} — <em>enter para guardar</em></>
          : <>&nbsp;</>}
      </p>
    </form>
  );
}
