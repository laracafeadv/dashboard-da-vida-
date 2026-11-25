'use client';
import { useEffect, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { useStore } from './store';

const LOCAL_STAMP = 'diario-da-vida:sincronizado-em';

/** Só os dados (sem funções) do estado. */
function snapshot() {
  const s = useStore.getState() as unknown as Record<string, unknown>;
  return Object.fromEntries(Object.entries(s).filter(([, v]) => typeof v !== 'function'));
}

function readStamp() {
  try { return localStorage.getItem(LOCAL_STAMP) ?? ''; } catch { return ''; }
}
function writeStamp(v: string) {
  try { localStorage.setItem(LOCAL_STAMP, v); } catch { /* sem armazenamento local */ }
}

export type SyncStatus = 'local' | 'entrando' | 'sincronizando' | 'salvo' | 'erro';

/**
 * Mantém o estado do aparelho e o da nuvem iguais.
 * Ao entrar: se a nuvem for mais nova, ela vence; senão, o aparelho é enviado.
 * Depois disso, cada mudança é salva na nuvem (com uma pequena espera para agrupar cliques).
 */
export function useCloudSync() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(!supabase);
  const [status, setStatus] = useState<SyncStatus>(supabase ? 'entrando' : 'local');
  const applyingRemote = useRef(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || !session) return;
    const db = supabase;
    const userId = session.user.id;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const push = async () => {
      setStatus('sincronizando');
      const now = new Date().toISOString();
      const { error } = await db.from('user_state').upsert({ user_id: userId, data: snapshot(), updated_at: now });
      if (cancelled) return;
      if (error) setStatus('erro');
      else { writeStamp(now); setStatus('salvo'); }
    };

    (async () => {
      setStatus('sincronizando');
      const { data, error } = await db.from('user_state').select('data, updated_at').eq('user_id', userId).maybeSingle();
      if (cancelled) return;
      if (error) { setStatus('erro'); return; }
      if (data && data.updated_at > readStamp()) {
        applyingRemote.current = true;
        useStore.setState(data.data as Partial<ReturnType<typeof useStore.getState>>);
        applyingRemote.current = false;
        writeStamp(data.updated_at);
        setStatus('salvo');
      } else {
        await push();
      }
    })();

    const unsub = useStore.subscribe(() => {
      if (applyingRemote.current) return;
      clearTimeout(timer);
      timer = setTimeout(push, 1200);
    });
    return () => { cancelled = true; clearTimeout(timer); unsub(); };
  }, [session]);

  return { session, ready, status };
}
