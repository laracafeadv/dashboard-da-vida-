/* Motivos visuais da identidade "Convite": papel marfim em relevo,
   renda com ilhoses, lacre marfim, moldura dourada e seda pintada. */

type P = { className?: string };

function scallopPath(cx: number, cy: number, rx: number, ry: number, n: number) {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  });
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % n];
    const r = (Math.hypot(x2 - x1, y2 - y1) / 2) * 1.05;
    d += ` A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  return d + 'Z';
}

/** Raminho de folhas bordado, usado como ornamento. */
export function Sprig({ className }: P) {
  const leaf = (x: number, y: number, r: number) => (
    <path key={`${x}-${y}`} d="M0 0 C4 -5 11 -5 14 0 C11 5 4 5 0 0Z" transform={`translate(${x} ${y}) rotate(${r})`} />
  );
  return (
    <svg className={`sprig ${className ?? ''}`} viewBox="0 0 120 24" aria-hidden="true" fill="currentColor" stroke="none">
      <path d="M8 12 H112" stroke="currentColor" strokeWidth="1" fill="none" />
      {[20, 34, 48].map((x) => [leaf(x, 12, -32), leaf(x + 6, 12, 32)])}
      {[72, 86, 100].map((x) => [leaf(x, 12, -148), leaf(x - 6, 12, 148)])}
      <circle cx="60" cy="12" r="2.6" />
      <circle cx="54" cy="12" r="1.3" />
      <circle cx="66" cy="12" r="1.3" />
    </svg>
  );
}

/** Cartão oval de papel marfim em relevo, com ilhoses e bordado de folhas. */
export function EmbossedOval({ id, className, children }: P & { id: string; children?: React.ReactNode }) {
  const holes = Array.from({ length: 40 }, (_, i) => {
    const a = (i / 40) * Math.PI * 2;
    return <ellipse key={i} cx={240 + 196 * Math.cos(a)} cy={170 + 128 * Math.sin(a)} rx="2.6" ry="1.9" transform={`rotate(${(a * 180) / Math.PI + 90} ${240 + 196 * Math.cos(a)} ${170 + 128 * Math.sin(a)})`} />;
  });
  const sprig = (x: number, y: number, rot: number, key: string) => (
    <g key={key} transform={`translate(${x} ${y}) rotate(${rot})`} fill="#e4dccd" stroke="#e4dccd">
      <path d="M-34 0 H34" strokeWidth="1.2" fill="none" />
      {[-24, -12, 12, 24].map((lx) => (
        <g key={lx}>
          <path d="M0 0 C3 -4 9 -4 12 0 C9 4 3 4 0 0Z" transform={`translate(${lx} 0) rotate(${lx < 0 ? -35 : -145})`} />
          <path d="M0 0 C3 -4 9 -4 12 0 C9 4 3 4 0 0Z" transform={`translate(${lx} 0) rotate(${lx < 0 ? 35 : 145})`} />
        </g>
      ))}
      <circle r="2.4" stroke="none" />
    </g>
  );
  return (
    <div className={`emb-oval ${className ?? ''}`}>
      <svg viewBox="0 0 480 340" aria-hidden="true">
        <defs>
          <radialGradient id={`${id}-paper`} cx="45%" cy="38%" r="70%">
            <stop offset="0" stopColor="#fbf8f2" />
            <stop offset=".75" stopColor="#f1ebe0" />
            <stop offset="1" stopColor="#e4dccd" />
          </radialGradient>
          <filter id={`${id}-sh`} x="-15%" y="-15%" width="130%" height="140%">
            <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#1a0b08" floodOpacity=".45" />
          </filter>
          <filter id={`${id}-emb`}>
            <feDropShadow dx="0" dy="1.2" stdDeviation=".4" floodColor="#fff" floodOpacity=".9" />
          </filter>
        </defs>
        <path d={scallopPath(240, 170, 222, 150, 46)} fill={`url(#${id}-paper)`} filter={`url(#${id}-sh)`} />
        <ellipse cx="240" cy="170" rx="208" ry="138" fill="none" stroke="#e6dfd2" strokeWidth="1" />
        <g fill="#5a463c" opacity=".55">{holes}</g>
        <g filter={`url(#${id}-emb)`}>
          {sprig(240, 46, 0, 't')}
          {sprig(240, 294, 0, 'b')}
          {sprig(66, 170, 90, 'l')}
          {sprig(414, 170, 90, 'r')}
        </g>
      </svg>
      <div className="emb-content">{children}</div>
    </div>
  );
}

/** Lacre de cera marfim com monograma. */
export function IvorySeal({ id, className, mono = 'DV' }: P & { id: string; mono?: string }) {
  const n = 24;
  const d =
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      const r = 45 + (i % 2 ? 2.4 : -1.2) + (i % 7 === 0 ? 1.8 : 0);
      return `${i ? 'L' : 'M'}${(50 + r * Math.cos(a)).toFixed(1)} ${(50 + r * Math.sin(a)).toFixed(1)}`;
    }).join(' ') + 'Z';
  return (
    <svg className={`seal ${className ?? ''}`} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-wax`} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#fbf6ea" />
          <stop offset=".55" stopColor="#e7dcc6" />
          <stop offset="1" stopColor="#c2b293" />
        </radialGradient>
        <filter id={`${id}-sh`} x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1a0b08" floodOpacity=".45" />
        </filter>
      </defs>
      <path d={d} fill={`url(#${id}-wax)`} filter={`url(#${id}-sh)`} />
      <circle cx="50" cy="50" r="30" fill="none" stroke="#bfae8c" strokeWidth="2.5" />
      <circle cx="50" cy="51.2" r="30" fill="none" stroke="#fffdf6" strokeWidth="1" opacity=".8" />
      <text x="50" y="62" textAnchor="middle" fontSize="30" fill="#b3a07c" style={{ fontFamily: 'var(--f-script)' }}>{mono}</text>
      <text x="50" y="61" textAnchor="middle" fontSize="30" fill="#fffaf0" opacity=".7" style={{ fontFamily: 'var(--f-script)' }}>{mono}</text>
    </svg>
  );
}

/** Moldura oval dourada com laço, para o princípio da semana. */
export function GildedFrame({ id, className, children }: P & { id: string; children?: React.ReactNode }) {
  const beads = Array.from({ length: 44 }, (_, i) => {
    const a = (i / 44) * Math.PI * 2;
    return <circle key={i} cx={100 + 74 * Math.cos(a)} cy={140 + 98 * Math.sin(a)} r="2.2" />;
  });
  return (
    <div className={`gilded ${className ?? ''}`}>
      <svg viewBox="0 0 200 260" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f2dc9e" />
            <stop offset=".3" stopColor="#b98b3e" />
            <stop offset=".55" stopColor="#f6e3a8" />
            <stop offset=".8" stopColor="#9a6f2c" />
            <stop offset="1" stopColor="#d8b46a" />
          </linearGradient>
          <radialGradient id={`${id}-pearl`} cx="45%" cy="35%" r="70%">
            <stop offset="0" stopColor="#fbf7ee" />
            <stop offset=".7" stopColor="#ece2d0" />
            <stop offset="1" stopColor="#d6c7ad" />
          </radialGradient>
          <filter id={`${id}-sh`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#120705" floodOpacity=".55" />
          </filter>
        </defs>
        <g filter={`url(#${id}-sh)`}>
          <ellipse cx="100" cy="140" rx="88" ry="112" fill={`url(#${id}-gold)`} />
          <ellipse cx="100" cy="140" rx="80" ry="104" fill="none" stroke="#7d5821" strokeWidth="1.2" />
          <g fill={`url(#${id}-gold)`} stroke="#7d5821" strokeWidth=".5">{beads}</g>
          <ellipse cx="100" cy="140" rx="68" ry="91" fill={`url(#${id}-pearl)`} stroke="#8a6427" strokeWidth="1.5" />
          {/* laço */}
          <g fill={`url(#${id}-gold)`} stroke="#7d5821" strokeWidth="1">
            <path d="M100 32 C82 10 54 14 58 30 C62 44 86 40 100 34Z" />
            <path d="M100 32 C118 10 146 14 142 30 C138 44 114 40 100 34Z" />
            <path d="M96 36 L84 60 L92 58 L98 38Z" />
            <path d="M104 36 L116 60 L108 58 L102 38Z" />
            <ellipse cx="100" cy="33" rx="8" ry="7" />
          </g>
        </g>
      </svg>
      <div className="gilded-content">{children}</div>
    </div>
  );
}

/** Fundo de seda/linho pintado, gerado por filtro (sem fotos). */
export function SilkBackdrop({ id, className }: P & { id: string }) {
  return (
    <svg className={`silk ${className ?? ''}`} preserveAspectRatio="none" viewBox="0 0 1200 460" aria-hidden="true">
      <defs>
        <filter id={`${id}-silk`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.0042 0.0016" numOctaves="2" seed="5" result="n" />
          <feDiffuseLighting in="n" lightingColor="#f1e7d6" surfaceScale="26" result="l">
            <feDistantLight azimuth="210" elevation="48" />
          </feDiffuseLighting>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="g" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 .4  0 0 0 0 .33  0 0 0 0 .25  0 0 0 .08 0" result="grain" />
          <feComposite in="grain" in2="l" operator="over" />
        </filter>
        <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1512" stopOpacity=".55" />
          <stop offset=".35" stopColor="#2a1512" stopOpacity="0" />
          <stop offset=".72" stopColor="#6b4a2c" stopOpacity=".18" />
          <stop offset="1" stopColor="#5a3a1f" stopOpacity=".7" />
        </linearGradient>
      </defs>
      <rect width="1200" height="460" filter={`url(#${id}-silk)`} />
      <rect width="1200" height="460" fill={`url(#${id}-shade)`} />
    </svg>
  );
}
