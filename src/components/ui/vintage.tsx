/* Motivos visuais da identidade "correspondência romântica":
   moldura de renda oval, lacre com coração, arabesco com coração e trepadeira. */

type P = { className?: string };

function scallopPath(cx: number, cy: number, rx: number, ry: number, n: number, offset = 0) {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = ((i + offset) / n) * Math.PI * 2 - Math.PI / 2;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  });
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % n];
    const r = (Math.hypot(x2 - x1, y2 - y1) / 2) * 1.08;
    d += ` A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  return d + 'Z';
}

/** Medalhão oval com babado de renda. O conteúdo vai por cima, centralizado. */
export function LaceOval({ id, className, children }: P & { id: string; children?: React.ReactNode }) {
  return (
    <div className={`lace ${className ?? ''}`}>
      <svg viewBox="0 0 400 500" aria-hidden="true">
        <defs>
          <pattern id={`${id}-lace`} width="7" height="7" patternUnits="userSpaceOnUse">
            <rect width="7" height="7" fill="#fbf6ee" />
            <circle cx="3.5" cy="3.5" r="1.15" fill="#d8cab6" />
          </pattern>
          <pattern id={`${id}-dots`} width="9" height="9" patternUnits="userSpaceOnUse">
            <rect width="9" height="9" fill="#f6efe4" />
            <circle cx="4.5" cy="4.5" r=".7" fill="#e6dccd" />
          </pattern>
          <radialGradient id={`${id}-shade`} cx="50%" cy="45%" r="55%">
            <stop offset="70%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#5b3a22" stopOpacity=".28" />
          </radialGradient>
          <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#2a0c08" floodOpacity=".35" />
          </filter>
        </defs>
        <g filter={`url(#${id}-shadow)`}>
          <path d={scallopPath(200, 250, 178, 228, 34)} fill={`url(#${id}-lace)`} />
          <path d={scallopPath(200, 250, 178, 228, 34)} fill={`url(#${id}-shade)`} />
          <path d={scallopPath(200, 250, 160, 208, 34, 0.5)} fill="#fdf9f3" opacity=".55" />
          <path d={scallopPath(200, 250, 160, 208, 34, 0.5)} fill="none" stroke="#e2d6c4" strokeWidth="1" />
          <ellipse cx="200" cy="250" rx="146" ry="194" fill={`url(#${id}-dots)`} stroke="#e0d3c0" strokeWidth="1.2" />
        </g>
      </svg>
      <div className="lace-content">{children}</div>
    </div>
  );
}

/** Lacre de cera com coração em relevo. */
export function WaxSeal({ id, className }: P & { id: string }) {
  const n = 22;
  const d =
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      const r = 46 + (i % 2 ? 2.6 : -1.4) + (i % 5 === 0 ? 1.5 : 0);
      return `${i ? 'L' : 'M'}${(50 + r * Math.cos(a)).toFixed(1)} ${(50 + r * Math.sin(a)).toFixed(1)}`;
    }).join(' ') + 'Z';
  return (
    <svg className={`seal ${className ?? ''}`} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-wax`} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#a1353a" />
          <stop offset=".6" stopColor="#7a1c22" />
          <stop offset="1" stopColor="#4c0d12" />
        </radialGradient>
        <filter id={`${id}-sh`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#2a0608" floodOpacity=".45" />
        </filter>
      </defs>
      <path d={d} fill={`url(#${id}-wax)`} filter={`url(#${id}-sh)`} />
      <circle cx="50" cy="50" r="31" fill="none" stroke="#4f0d12" strokeWidth="3" opacity=".55" />
      <circle cx="50" cy="51" r="31" fill="none" stroke="#c45a5e" strokeWidth="1" opacity=".45" />
      <path d="M50 66 C38 57 32 51 32 44 c0-6 4.5-10 9.5-10 4 0 7 2.4 8.5 5.6 1.5-3.2 4.5-5.6 8.5-5.6 5 0 9.5 4 9.5 10 0 7-6 13-18 22z" fill="none" stroke="#4a0b10" strokeWidth="3" />
      <path d="M50 66 C38 57 32 51 32 44 c0-6 4.5-10 9.5-10 4 0 7 2.4 8.5 5.6 1.5-3.2 4.5-5.6 8.5-5.6 5 0 9.5 4 9.5 10 0 7-6 13-18 22z" fill="none" stroke="#c0565b" strokeWidth="1" transform="translate(0 1)" opacity=".7" />
      <ellipse cx="38" cy="30" rx="10" ry="5" fill="#fff" opacity=".12" transform="rotate(-30 38 30)" />
    </svg>
  );
}

/** Arabesco com coração ao centro. */
export function Flourish({ className }: P) {
  const curl = 'M70 14 C62 6 50 6 44 12 C38 18 28 20 22 14 C17 9 21 3 27 5 C31 7 29 12 25 11 M44 12 C40 20 30 22 24 18';
  return (
    <svg className={`flourish ${className ?? ''}`} viewBox="0 0 160 28" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d={curl} />
      <path d={curl} transform="translate(160 0) scale(-1 1)" />
      <path d="M80 22 C74 17 71 14 71 11 c0-2.4 1.8-4 3.9-4 1.6 0 2.9 1 3.6 2.3.7-1.3 2-2.3 3.6-2.3 2.1 0 3.9 1.6 3.9 4 0 3-3 6-9 11z" fill="currentColor" stroke="none" />
    </svg>
  );
}
