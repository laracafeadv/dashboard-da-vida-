'use client';
import { fromISO, MONTHS, WEEKDAYS, WEEKDAYS_SHORT, weekOf } from '@/lib/dates';
import { routineFor, tasksFor, useStore } from '@/lib/store';
import { Icon } from '@/components/ui/ornaments';
import { Capture } from './Capture';
import { Countdown } from './Countdown';

interface Props { today: string; selected: string; onSelect: (d: string) => void }

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
}

const COUNT = ['', 'uma coisa precisa', 'duas coisas precisam', 'três coisas precisam'];

export function Frontispiece({ today, selected, onSelect }: Props) {
  const tasks = useStore((s) => s.tasks);
  const routine = useStore((s) => s.routine);
  const closes = useStore((s) => s.closes);
  const focos = useStore((s) => s.focos);
  const d = fromISO(selected);
  const isToday = selected === today;
  const stars = tasksFor(tasks, selected).filter((t) => t.star && !t.done).length;
  const weekday = WEEKDAYS[d.getDay()] + (d.getDay() > 0 && d.getDay() < 6 ? '-feira' : '');

  const line = isToday
    ? stars === 0
      ? <>Escolha o que importa hoje.</>
      : <>Hoje, só <em>{COUNT[stars]}</em> de você.</>
    : selected > today
      ? <>Você está planejando {weekday}.</>
      : <>Você está olhando para {weekday}.</>;

  return (
    <header className="front grain">
      <div className="front-day">
        <span className="caption">{isToday ? `${greeting()}, este é o seu dia` : 'Dia selecionado'}</span>
        <h1 className="front-title">{weekday}</h1>
        <span className="front-date">{d.getDate()} de {MONTHS[d.getMonth()]} de {d.getFullYear()}</span>
        <span className="front-focos"><span className="label">Focos do mês</span>{focos.join(' · ')}</span>
      </div>

      <Countdown line={line} />

      <Capture today={today} />

      <div className="week-cell">
        <span className="label">Esta semana</span>
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
      </div>
    </header>
  );
}
