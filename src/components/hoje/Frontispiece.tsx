'use client';
import { dayOfYear, fromISO, roman, WEEKDAYS, WEEKDAYS_SHORT, weekNumber, weekOf, longDate } from '@/lib/dates';
import { routineFor, tasksFor, useStore } from '@/lib/store';
import { DecoSun, Icon, Ornament } from '@/components/ui/ornaments';

interface Props { today: string; selected: string; onSelect: (d: string) => void }

export function Frontispiece({ today, selected, onSelect }: Props) {
  const dir = useStore((s) => s.direction);
  const tasks = useStore((s) => s.tasks);
  const routine = useStore((s) => s.routine);
  const closes = useStore((s) => s.closes);
  const focos = useStore((s) => s.focos);
  const d = fromISO(selected);
  const weekday = WEEKDAYS[d.getDay()];
  const title = weekday.charAt(0).toUpperCase() + weekday.slice(1) + (d.getDay() > 0 && d.getDay() < 6 ? '-feira' : '');

  return (
    <header className="front">
      <div className="front-line">
        <span>Edição nº {dayOfYear(selected)} · Semana {weekNumber(selected)}</span>
        <Ornament dir={dir} className="orn" />
        <span>Ano {roman(d.getFullYear())}</span>
      </div>
      <DecoSun className="deco-sun" />
      <h1 className="front-title">{title}</h1>
      <p className="front-sub">{longDate(selected)}</p>
      <div className="focos">
        Focos do mês
        {focos.map((f) => <span className="f" key={f}>{f}</span>)}
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
              {closes[iso] && <span className="closed">{Icon.tick}</span>}
              <span className="wd">{iso === today ? 'hoje' : WEEKDAYS_SHORT[day.getDay()]}</span>
              <span className="dn tabular">{day.getDate()}</span>
              <span className="dots" aria-hidden="true">{Array.from({ length: Math.min(n, 5) }, (_, i) => <i key={i} />)}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
