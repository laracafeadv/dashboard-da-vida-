'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@/lib/store';
import type { NoteKind } from '@/lib/types';
import { Composer } from '@/components/caderno/Composer';
import { Img } from '@/components/caderno/Img';
import { matches, noteTitle, shortDate } from '@/components/caderno/util';

type Filtro = 'todos' | NoteKind;

export default function CadernoPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const notes = useStore((s) => s.notes);
  const [q, setQ] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [tema, setTema] = useState<string | null>(null);
  const [pasta, setPasta] = useState<string | null>(null);

  const temas = useMemo(() => {
    const count = new Map<string, number>();
    notes.forEach((n) => n.temas.forEach((t) => count.set(t, (count.get(t) ?? 0) + 1)));
    return [...count.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
  }, [notes]);
  const pastas = useMemo(() => [...new Set(notes.map((n) => n.pasta).filter(Boolean) as string[])].sort(), [notes]);

  const visible = notes.filter(
    (n) => (filtro === 'todos' || n.kind === filtro) && (!tema || n.temas.includes(tema)) && (!pasta || n.pasta === pasta) && matches(n, q),
  );

  if (!mounted) return <div style={{ minHeight: '100dvh' }} aria-busy="true" />;

  return (
    <article className="caderno">
      <header className="front">
        <p className="kicker">Pensamentos e referências</p>
        <h1 className="front-title"><span className="mix">Seu</span> caderno</h1>
        <p className="front-summary">
          {notes.length === 0 ? 'Nada guardado ainda. Comece pelo campo abaixo.' : `${notes.length} ${notes.length === 1 ? 'registro' : 'registros'} guardados.`}
        </p>
      </header>

      <Composer temasSugeridos={temas} pastas={pastas} />

      {notes.length > 0 && (
        <section className="section">
          <div className="finder">
            <label htmlFor="busca" className="sr-only">Buscar</label>
            <input id="busca" type="search" placeholder="buscar" value={q} onChange={(e) => setQ(e.target.value)} />
            <div className="seg" role="group" aria-label="Tipo">
              {(['todos', 'pensamento', 'referencia'] as Filtro[]).map((f) => (
                <button key={f} aria-pressed={filtro === f} onClick={() => setFiltro(f)}>
                  {f === 'todos' ? 'Todos' : f === 'pensamento' ? 'Pensamentos' : 'Referências'}
                </button>
              ))}
            </div>
            {(temas.length > 0 || pastas.length > 0) && (
              <p className="filters">
                {pastas.map((p) => (
                  <button key={p} className={`chip${pasta === p ? ' on' : ''}`} onClick={() => setPasta(pasta === p ? null : p)}>{p}</button>
                ))}
                {temas.map((t) => (
                  <button key={t} className={`chip tema${tema === t ? ' on' : ''}`} onClick={() => setTema(tema === t ? null : t)}>#{t}</button>
                ))}
              </p>
            )}
          </div>

          <ul className="notes">
            {visible.map((n) => (
              <li key={n.id}>
                <Link href={`/caderno/nota?id=${n.id}`} className="note-row">
                  <span className="note-meta">{shortDate(n.createdAt)} · {n.kind === 'referencia' ? 'referência' : 'pensamento'}{n.pasta ? ` · ${n.pasta}` : ''}</span>
                  <span className="note-title">{noteTitle(n)}</span>
                  {n.body && n.title && <span className="note-excerpt">{n.body.slice(0, 160)}{n.body.length > 160 ? '…' : ''}</span>}
                  {n.images.length > 0 && (
                    <span className="note-thumbs">
                      {n.images.slice(0, 4).map((img) => <Img key={img.id} img={img} className="thumb" />)}
                      {n.images.length > 4 && <span className="more">+{n.images.length - 4}</span>}
                    </span>
                  )}
                  {n.temas.length > 0 && <span className="note-temas">{n.temas.map((t) => `#${t}`).join('  ')}</span>}
                </Link>
              </li>
            ))}
            {visible.length === 0 && <li className="empty">Nada encontrado com esses filtros.</li>}
          </ul>
        </section>
      )}
    </article>
  );
}
