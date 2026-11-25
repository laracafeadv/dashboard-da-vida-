'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useToast } from '@/lib/store';
import { Icon } from '@/components/ui/ornaments';
import { GildedFrame, IvorySeal } from '@/components/ui/vintage';

const NAV = [
  { href: '/', label: 'Hoje', icon: Icon.hoje },
  { href: '/planejar', label: 'Planejar', icon: Icon.planejar, soon: true },
  { href: '/areas', label: 'Áreas da vida', short: 'Áreas', icon: Icon.areas, soon: true },
  { href: '/caderno', label: 'Caderno', icon: Icon.caderno, soon: true },
  { href: '/revisoes', label: 'Revisões', icon: Icon.revisoes, soon: true },
];

const PRINCIPLES = [
  'Quando algo novo entra, algo precisa sair.',
  'Três prioridades. O resto é bônus.',
  'Espaço livre na agenda também é compromisso.',
  'Semana difícil pede a versão mínima, não um sistema novo.',
  'Toda tarefa precisa de uma próxima ação clara.',
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const toast = useToast();
  const [principle, setPrinciple] = useState(PRINCIPLES[0]);

  useEffect(() => {
    const week = Math.floor(Date.now() / (7 * 864e5));
    setPrinciple(PRINCIPLES[week % PRINCIPLES.length]);
  }, []);

  useEffect(() => {
    if (!toast.message) return;
    const t = setTimeout(toast.hide, 4200);
    return () => clearTimeout(t);
  }, [toast.key, toast.message, toast.hide]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <div className="app">
      <aside className="sidebar">
        <Link href="/" className="brand">
          <IvorySeal id="brand-seal" />
          <span className="brand-name">Diário da Vida</span>
          <span className="brand-sub">caderno pessoal</span>
        </Link>

        <nav className="nav" aria-label="Seções">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={isActive(n.href) ? 'page' : undefined} className={n.soon ? 'is-soon' : undefined}>
              {n.icon}
              <span>{n.label}</span>
            </Link>
          ))}
        </nav>

        <div className="side-frame">
          <GildedFrame id="principle-frame">
            <b>princípio da semana</b>
            <p>{principle}</p>
          </GildedFrame>
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
