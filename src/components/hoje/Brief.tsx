'use client';
import { buildBriefing } from '@/lib/briefing';
import { useStore, useToast } from '@/lib/store';
import type { CalendarEvent, RoutineItem, Task } from '@/lib/types';
import { Card } from './Card';

interface Props { tasks: Task[]; events: CalendarEvent[]; routine: RoutineItem[]; isToday: boolean }

export function Brief({ tasks, events, routine, isToday }: Props) {
  const toggleStar = useStore((s) => s.toggleStar);
  const toast = useToast((s) => s.show);
  const b = buildBriefing(tasks, events, routine, isToday);

  return (
    <Card title={isToday ? 'Resumo da manhã' : 'Resumo do dia'} meta="escrito sozinho" className="brief">
      {b.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
      <div className="acts">
        {b.suggestion ? (
          <>
            <button className="btn" onClick={() => { if (toggleStar(b.suggestion!.id)) toast('Sugestão aceita: virou prioridade.'); }}>
              Priorizar “{b.suggestion.title.length > 34 ? b.suggestion.title.slice(0, 32) + '…' : b.suggestion.title}”
            </button>
            <span className="hint">Sugestão para completar as três prioridades.</span>
          </>
        ) : (
          <span className="hint">Prioridades definidas. Na próxima fase, a IA escreve este resumo lendo sua agenda real.</span>
        )}
      </div>
    </Card>
  );
}
