'use client';
import { fromISO, MONTHS, WEEKDAYS, WEEKDAYS_SHORT, weekOf } from '@/lib/dates';
import { routineFor, tasksFor, useStore } from '@/lib/store';
import { Flourish, LaceOval } from '@/components/ui/vintage';
import { Icon } from '@/components/ui/ornaments';
import { Capture } from './Capture';

interface Props { today: string; selected: string; onSelect: (d: string) => void }

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
}

export function Frontispiece({ today, selected, onSelect }: Props) {
  const tasks = useStore((s) => s.tasks);
  const routine = useStore((s) => s.routine);
  const closes = useStore((s) => s.closes);
  const focos = useStore((s) => s.focos);
  const d = fromISO(selected);
  const isToday = selected === today;
  const stars = tasksFor(tasks, selected).filter((t) => t.star && !t.done).length;

  const headline = isToday
    ? stars === 0
      ? <>{greeting()}. <em>Escolha o que importa hoje.</em></>
      : <>{greeting()}. Hoje, <em>só {['', 'uma coisa precisa', 'duas coisas precisam', 'três coisas precisam'][stars]} de você.</em></>
    : selected > today
      ? <>Planejando <em>{WEEKDAYS[d.getDay()]}.</em></>
      : <>Olhando para <em>{WEEKDAYS[d.getDay()]}.</em></>;

  return (
    <header className="front">
      <LaceOval id="date-oval" className="front-oval">
        <span className="oval-wd">{WEEKDAYS[d.getDay()]}{d.getDay() > 0 && d.getDay() < 6 ? '-feira' : ''}</span>
        <span className="oval-day tabular">{d.getDate()}</span>
        <span className="oval-month">de {MONTHS[d.getMonth()]}</span>
      </LaceOval>

      <div className="front-card">
        <Flourish className="flourish front-flourish" />
        <h1 className="front-title">{headline}</h1>
        <div className="focos">
          <span className="eyebrow">Focos do mês</span>
          {focos.map((f) => <span className="foco" key={f}>{f}</span>)}
        </div>
        <Capture today={today} />
      </div>

      <div className="week" role="group" aria-label="Dias da semana">
        {weekOf(today).map((iso) => {
          const n = tasksFor(tasks, iso).filter((t) => !t.done).length + routineFor(routine, iso).length;
          const day = fromISO(iso);
          return (
            <button
              key={iso}
              className={`day${iso === today ? ' is-today' : ''}`}
              aria-pressed={iso === selected}
              aria-label={`${WEEKDAYS[day.getDay()]}, ${day.getDate()}${iso === today ? ' (hoje)' : ''}`}
              onClick={() => onSelect(iso)}
            >
              <span className="wd">{iso === today ? 'hoje' : WEEKDAYS_SHORT[day.getDay()]}</span>
              <span className="dn tabular">{day.getDate()}</span>
              <span className="dots" aria-hidden="true">
                {closes[iso] ? <span className="closed">{Icon.tick}</span> : Array.from({ length: Math.min(n, 5) }, (_, i) => <i key={i} />)}
              </span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
