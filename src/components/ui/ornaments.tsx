import type { Direction } from '@/lib/types';

type P = { className?: string };

/** Ornamento de título: muda conforme a direção visual. */
export function Ornament({ dir, className }: P & { dir: Direction }) {
  if (dir === 'almanaque')
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12 1l2.2 7.1L21.5 6 16.4 11.6 23 15l-7.3.9L16 23l-4-6.1L8 23l.3-7.1L1 15l6.6-3.4L2.5 6l7.3 2.1z" />
      </svg>
    );
  if (dir === 'deco')
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12 3l5 9-5 9-5-9z" />
        <path fill="none" stroke="currentColor" d="M12 0v3M12 21v3M2 12h4M18 12h4" />
      </svg>
    );
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 21c-.4-2.6-1.8-4.2-4-5.2C5.3 14.7 3.5 12.6 3.7 9.9 3.9 7.4 6 5.6 8.3 6c1.7.3 2.7 1.7 2.6 3.2-.1 1.2-1 2-2 2-.8 0-1.4-.6-1.4-1.3 0-.5.3-.9.8-1-.9-.6-2.4 0-2.6 1.4-.3 1.9 1.4 3.4 3.4 4 1.3.4 2.3 1.1 2.9 2.2V5.3C11 4.5 10.2 3.7 9.3 3.2c1.3 0 2.2.6 2.7 1.6.5-1 1.4-1.6 2.7-1.6-.9.5-1.7 1.3-2.7 2.1v11.2c.6-1.1 1.6-1.8 2.9-2.2 2-.6 3.7-2.1 3.4-4-.2-1.4-1.7-2-2.6-1.4.5.1.8.5.8 1 0 .7-.6 1.3-1.4 1.3-1 0-1.9-.8-2-2-.1-1.5.9-2.9 2.6-3.2 2.3-.4 4.4 1.4 4.6 3.9.2 2.7-1.6 4.8-4.3 5.9-2.2 1-3.6 2.6-4 5.2z"
      />
    </svg>
  );
}

/** Selo de lacre com o monograma DV. */
export function Seal({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <path id="seal-ring" d="M50 50 m-36 0 a36 36 0 1 1 72 0 a36 36 0 1 1 -72 0" />
      </defs>
      <path
        fill="var(--stamp)"
        d="M50 3c5 0 7 4 11 5s9-1 12 3 1 8 4 11 8 3 9 8-3 7-3 11 4 7 3 12-6 5-9 8-1 8-4 11-8 2-12 3-6 5-11 5-7-4-11-5-9 2-12-3-1-8-4-11-8-3-9-8 3-7 3-11-4-7-3-12 6-5 9-8 1-8 4-11 8-2 12-3 6-5 11-5z"
      />
      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,235,210,.35)" strokeWidth="1" />
      <circle cx="50" cy="50" r="27" fill="none" stroke="rgba(255,235,210,.45)" strokeWidth="1" />
      <text fontSize="8.5" letterSpacing="2.4" fill="rgba(255,240,220,.85)" fontFamily="Georgia, serif">
        <textPath href="#seal-ring">DIÁRIO · DA · VIDA · MMXXVI ·</textPath>
      </text>
      <text x="50" y="59" textAnchor="middle" fontSize="26" fontStyle="italic" fill="rgba(255,240,220,.95)" fontFamily="Georgia, serif">
        DV
      </text>
    </svg>
  );
}

/** Leque art déco usado no frontispício da direção Déco. */
export function DecoSun({ className }: P) {
  const rays = Array.from({ length: 11 }, (_, i) => {
    const a = Math.PI + (i * Math.PI) / 10;
    return <line key={i} x1="110" y1="64" x2={110 + Math.cos(a) * 100} y2={64 + Math.sin(a) * 60} />;
  });
  return (
    <svg className={className} viewBox="0 0 220 64" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="0.8">
      <path d="M10 64 A100 60 0 0 1 210 64" />
      <path d="M40 64 A70 42 0 0 1 180 64" />
      <path d="M70 64 A40 24 0 0 1 150 64" />
      {rays}
    </svg>
  );
}

export const Icon = {
  hoje: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" /></svg>
  ),
  planejar: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="1" /><path d="M3.5 9.5h17M8 3v4M16 3v4M7.5 13h3M7.5 16.5h6" /></svg>
  ),
  areas: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><path d="M12 3.5V12l6 3.5" /></svg>
  ),
  caderno: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h11.5a1.5 1.5 0 0 1 1.5 1.5v15H7.5A2.5 2.5 0 0 1 5 17.5V4.5a1 1 0 0 1 1-1z" /><path d="M5 17.5A2.5 2.5 0 0 1 7.5 15H19M9 7.5h6" /></svg>
  ),
  revisoes: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.6-5.9" /><path d="M4 4v4.5h4.5M12 8v4.5l3 2" /></svg>
  ),
  pen: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M4 20l1.2-4.6L15.8 4.8a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L8.6 18.8z" /><path d="M13.8 6.8l3.4 3.4M4 20h7" /></svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.7 6 6.5.6-4.9 4.3 1.5 6.4L12 16.8l-5.8 3.3 1.5-6.4-4.9-4.3 6.5-.6z" /></svg>
  ),
  check: (
    <svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 7.5l3 3 6-7" /></svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="1" /><path d="M3.5 9.5h17M8 3v4M16 3v4" /></svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20c.8-3.7 3.6-5.5 7-5.5s6.2 1.8 7 5.5" /></svg>
  ),
  feather: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4c-7 0-12 5-13 13l-2 3M7 17h6c3 0 6-4 7-13" /></svg>
  ),
  tick: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M7.5 12.5l3 3 6-6.5" /></svg>
  ),
};
