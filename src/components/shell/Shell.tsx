'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useToast } from '@/lib/store';
import { useCloudSync } from '@/lib/sync';
import { supabase, cloudEnabled } from '@/lib/supabase';
import { Login } from './Login';
import { useUI } from '@/lib/ui';
import { AddSheet } from '@/components/add/AddSheet';
import { TaskSheet } from '@/components/hoje/TaskSheet';
import { Icon } from '@/components/ui/ornaments';

// Só aparece no menu o que já funciona. Planejar, Áreas e Revisões entram quando estiverem prontos.
const NAV = [
  { href: '/', label: 'Hoje', icon: Icon.hoje },
  { href: '/caderno', label: 'Caderno', icon: Icon.caderno },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const toast = useToast();

  useEffect(() => {
    if (!toast.message) return;
    const t = setTimeout(toast.hide, 4200);
    return () => clearTimeout(t);
  }, [toast.key, toast.message, toast.hide]);

  const { session, ready, status } = useCloudSync();
  const openAdd = useUI((s) => s.openAdd);
  const needsLogin = cloudEnabled && ready && !session;
  const SYNC_LABEL = { local: '', entrando: '', sincronizando: 'salvando…', salvo: 'salvo na nuvem', erro: 'sem conexão — salvo no aparelho' } as const;

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <div className="app">
      <header className="topbar">
        <Link href="/" className="brand"><span className="mix">Diário</span> da Vida</Link>
        <nav className="nav" aria-label="Seções">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={isActive(n.href) ? 'page' : undefined}>
              {n.label}
            </Link>
          ))}
          {!needsLogin && <button className="add-top" onClick={() => openAdd()}>+ Adicionar</button>}
        </nav>
        {session && (
          <span className="account">
            <span className={`sync ${status}`}>{SYNC_LABEL[status]}</span>{' '}
            <button className="link" onClick={() => supabase?.auth.signOut()}>sair</button>
          </span>
        )}
      </header>

      <main className="main">{!ready ? null : needsLogin ? <Login /> : children}</main>

      {!needsLogin && (
        <nav className="tabbar" aria-label="Seções">
          <Link href="/" aria-current={isActive('/') ? 'page' : undefined}>{Icon.hoje}Hoje</Link>
          <button className="tab-add" onClick={() => openAdd()} aria-label="Adicionar"><span>+</span>Adicionar</button>
          <Link href="/caderno" aria-current={isActive('/caderno') ? 'page' : undefined}>{Icon.caderno}Caderno</Link>
        </nav>
      )}

      <AddSheet />
      <TaskSheet />

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
