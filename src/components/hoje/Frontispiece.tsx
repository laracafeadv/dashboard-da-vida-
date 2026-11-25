'use client';
import { fromISO, MONTHS, WEEKDAYS, WEEKDAYS_SHORT, weekOf } from '@/lib/dates';
import { useStore } from '@/lib/store';

interface Props { today: string; selected: string; onSelect: (d: string) => void; summary: string }

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Bom dia.' : h < 18 ? 'Boa tarde.' : 'Boa noite.';
}

export function Frontispiece({ today, selected, onSelect, summary }: Props) {
  const closes = useStore((s) => s.closes);
  const d = fromISO(selected);
  const isToday = selected === today;
  const weekday = WEEKDAYS[d.getDay()] + (d.getDay() > 0 && d.getDay() < 6 ? '-feira' : '');

  return (
    <header className="front">
      <p className="kicker">{isToday ? greeting() : selected > today ? 'Planejando' : 'Olhando para trás'}</p>
      <h1 className="front-title">
        <span className="mix">{isToday ? 'Hoje é' : 'Dia de'}</span> <span className="nowrap">{weekday}</span>
      </h1>
      <p className="front-date">{d.getDate()} de {MONTHS[d.getMonth()]}</p>
      <p className="front-summary">{summary}</p>

      <p className="week-label">ver outro dia</p>
      <nav className="week" aria-label="Dias da semana">
        {weekOf(today).map((iso) => {
          const day = fromISO(iso);
          return (
            <button key={iso} aria-pressed={iso === selected} onClick={() => onSelect(iso)} className={iso === today ? 'is-today' : undefined}>
              {iso === today ? 'hoje' : WEEKDAYS_SHORT[day.getDay()]} {day.getDate()}{closes[iso] ? ' ✓' : ''}
            </button>
          );
        })}
      </nav>

    </header>
  );
}
