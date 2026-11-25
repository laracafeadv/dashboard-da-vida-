'use client';
import { useEffect, useState } from 'react';
import { MONTHS } from '@/lib/dates';

const pad = (n: number) => String(n).padStart(2, '0');

/** Relógio datilografado: quanto resta do dia e do mês. */
export function Countdown({ line }: { line: React.ReactNode }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const left = Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
  const h = Math.floor(left / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthLeft = lastDay - now.getDate();

  return (
    <section className="clock" aria-label="Tempo restante">
      <p className="clock-title">O dia termina em</p>
      <div className="clock-digits" role="timer" aria-live="off">
        <span><b className="tabular">{pad(h)}</b><small>horas</small></span>
        <i>:</i>
        <span><b className="tabular">{pad(m)}</b><small>minutos</small></span>
        <i>:</i>
        <span><b className="tabular">{pad(s)}</b><small>segundos</small></span>
      </div>
      <p className="clock-month">e {MONTHS[now.getMonth()]} termina em {monthLeft} {monthLeft === 1 ? 'dia' : 'dias'}</p>
      <p className="clock-line">{line}</p>
    </section>
  );
}
