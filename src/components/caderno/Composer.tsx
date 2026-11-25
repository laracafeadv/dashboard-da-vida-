'use client';
import { useRef, useState } from 'react';
import { storeImage } from '@/lib/images';
import { useStore, useToast } from '@/lib/store';
import type { NoteImage, NoteKind } from '@/lib/types';
import { Img } from './Img';
import { parseTemas } from './util';

/** Registro rápido: escrever (ou ditar pelo teclado), anexar imagens, dar temas e pasta. */
export function Composer({ temasSugeridos, pastas }: { temasSugeridos: string[]; pastas: string[] }) {
  const addNote = useStore((s) => s.addNote);
  const toast = useToast((s) => s.show);
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<NoteKind>('pensamento');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [temas, setTemas] = useState('');
  const [pasta, setPasta] = useState('');
  const [images, setImages] = useState<NoteImage[]>([]);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => { setTitle(''); setBody(''); setTemas(''); setPasta(''); setImages([]); setKind('pensamento'); setOpen(false); };

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      const added = await Promise.all(Array.from(files).map(storeImage));
      setImages((prev) => [...prev, ...added]);
      setKind('referencia');
      setOpen(true);
    } catch {
      toast('Não foi possível ler a imagem.');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() && !images.length && !title.trim()) return;
    addNote({ kind, title: title.trim(), body: body.trim(), images, temas: parseTemas(temas), pasta: pasta.trim() || undefined });
    toast(kind === 'referencia' ? 'Referência guardada.' : 'Pensamento guardado.');
    reset();
  };

  const addTema = (t: string) => setTemas((cur) => (parseTemas(cur).includes(t) ? cur : cur ? `${cur}, ${t}` : t));

  return (
    <form className={`composer${open ? ' is-open' : ''}`} onSubmit={save}>
      <label htmlFor="nota" className="sr-only">Escrever</label>
      <textarea
        id="nota"
        rows={open ? 6 : 1}
        value={body}
        onFocus={() => setOpen(true)}
        onChange={(e) => setBody(e.target.value)}
        placeholder={open ? 'Escreva como vier. Para ditar, toque no microfone do teclado.' : 'Escrever ou guardar algo…'}
      />

      {images.length > 0 && (
        <div className="composer-imgs">
          {images.map((img) => (
            <span key={img.id} className="composer-img">
              <Img img={img} />
              <button type="button" aria-label="Remover imagem" onClick={() => setImages(images.filter((i) => i.id !== img.id))}>×</button>
            </span>
          ))}
        </div>
      )}

      <div className="composer-bar">
        <input ref={fileRef} id="imagens" type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
        <button type="button" className="link" onClick={() => fileRef.current?.click()} disabled={busy}>
          {busy ? 'preparando imagem…' : 'anexar print ou foto'}
        </button>
        {!open && body === '' && <span />}
      </div>

      {open && (
        <div className="composer-more">
          <div className="seg" role="group" aria-label="Tipo">
            <button type="button" aria-pressed={kind === 'pensamento'} onClick={() => setKind('pensamento')}>Pensamento</button>
            <button type="button" aria-pressed={kind === 'referencia'} onClick={() => setKind('referencia')}>Referência</button>
          </div>
          <input aria-label="Título (opcional)" placeholder="título (opcional)" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input aria-label="Temas" placeholder="temas, separados por vírgula" value={temas} onChange={(e) => setTemas(e.target.value)} />
          {temasSugeridos.length > 0 && (
            <p className="sugestoes">
              {temasSugeridos.slice(0, 8).map((t) => (
                <button key={t} type="button" className="link" onClick={() => addTema(t)}>#{t}</button>
              ))}
            </p>
          )}
          <input aria-label="Pasta (opcional)" placeholder="pasta (opcional)" list="pastas" value={pasta} onChange={(e) => setPasta(e.target.value)} />
          <datalist id="pastas">{pastas.map((p) => <option key={p} value={p} />)}</datalist>
          <div className="composer-acts">
            <button type="button" className="link" onClick={reset}>cancelar</button>
            <button type="submit" className="btn">Guardar</button>
          </div>
        </div>
      )}
    </form>
  );
}
