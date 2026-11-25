'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useStore, useToast } from '@/lib/store';
import type { Direction } from '@/lib/types';
import { Icon, Seal } from '@/components/ui/ornaments';

const NAV = [
  { href: '/', label: 'Hoje', icon: Icon.hoje },
  { href: '/planejar', label: 'Planejar', icon: Icon.planejar, soon: true },
  { href: '/areas', label: 'Áreas da vida', short: 'Áreas', icon: Icon.areas, soon: true },
  { href: '/caderno', label: 'Caderno', icon: Icon.caderno, soon: true },
  { href: '/revisoes', label: 'Revisões', icon: Icon.revisoes, soon: true },
];

const DIRS: { id: Direction; label: string; swatch: string[] }[] = [
  { id: 'gabinete', label: 'Gabinete', swatch: ['#1e3b30', '#a98448', '#f5eedf'] },
  { id: 'almanaque', label: 'Almanaque', swatch: ['#1c2742', '#b5412b', '#f7f1e3'] },
  { id: 'deco', label: 'Déco', swatch: ['#121929', '#b8975b', '#efe6d1'] },
];

const PRINCIPLES = [
  'Quando algo novo entra, algo precisa sair.',
  'Três prioridades. O resto é bônus.',
  'Espaço livre na agenda também é compromisso.',
  'Semana ruim não pede sistema novo; pede a versão mínima.',
  'Toda tarefa precisa de uma próxima ação clara.',
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const direction = useStore((s) => s.direction);
  const setDirection = useStore((s) => s.setDirection);
  const toast = useToast();

  useEffect(() => {
    document.documentElement.dataset.dir = direction;
  }, [direction]);

  useEffect(() => {
    if (!toast.message) return;
    const t = setTimeout(toast.hide, 4200);
    return () => clearTimeout(t);
  }, [toast.key, toast.message, toast.hide]);

  const week = Math.floor(Date.now() / (7 * 864e5));
  const principle = PRINCIPLES[week % PRINCIPLES.length];
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <Seal className="seal" />
          <div>
            <div className="brand-name">Diário da Vida</div>
            <span className="brand-sub">Caderno pessoal</span>
          </div>
        </div>

        <nav className="nav" aria-label="Seções">
          <div className="nav-label">Seções</div>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={isActive(n.href) ? 'page' : undefined}>
              {n.icon}
              {n.label}
              {n.soon && <span className="soon">em breve</span>}
            </Link>
          ))}
        </nav>

        <div className="side-foot">
          <div className="principle">
            <b>Princípio da semana</b>
            <q>{principle}</q>
          </div>
          <div className="dir-picker" role="group" aria-label="Direção visual">
            {DIRS.map((d) => (
              <button key={d.id} aria-pressed={direction === d.id} onClick={() => setDirection(d.id)}>
                <i>{d.swatch.map((c) => <span key={c} style={{ background: c }} />)}</i>
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="main-inner">{children}</div>
      </main>

      <nav className="tabbar" aria-label="Seções">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} aria-current={isActive(n.href) ? 'page' : undefined}>
            {n.icon}
            {n.short ?? n.label}
          </Link>
        ))}
      </nav>

      <AnimatePresence>
        {toast.message && (
          <motion.div
            key={toast.key}
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 16, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 10, x: '-50%' }}
          >
            {Icon.feather}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
