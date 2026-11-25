'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { addDays, relativeLabel, todayISO } from '@/lib/dates';
import { storeImage } from '@/lib/images';
import { parseCapture } from '@/lib/parse';
import { MAX_PRIORITIES, useStore, useToast } from '@/lib/store';
import { useUI, type AddKind } from '@/lib/ui';
import type { NoteImage } from '@/lib/types';
import { Sheet } from '@/components/ui/Sheet';
import { Img } from '@/components/caderno/Img';
import { parseTemas } from '@/components/caderno/util';

const TITLES: Record<AddKind | 'escolher', string> = {
  escolher: 'O que você quer guardar?',
  tarefa: 'Nova tarefa',
  pensamento: 'Novo pensamento',
  imagem: 'Guardar print ou foto',
};

export function AddSheet() {
  const { add, openAdd, closeAdd } = useUI();
  return (
    <Sheet open={add !== null} onClose={closeAdd} title={add ? TITLES[add] : ''}>
      {add === 'escolher' && (
        <div className="choices">
          <button onClick={() => openAdd('tarefa')}>
            <b>Tarefa</b>
            <span>Algo para fazer, com dia. Aparece na tela Hoje no dia certo.</span>
          </button>
          <button onClick={() => openAdd('pensamento')}>
            <b>Pensamento</b>
            <span>Uma ideia, preocupação ou anotação solta. Vai para o Caderno.</span>
          </button>
          <button onClick={() => openAdd('imagem')}>
            <b>Print ou foto</b>
            <span>Uma referência do Instagram, de um site ou do seu caderno de papel. Vai para o Caderno.</span>
          </button>
        </div>
      )}
      {add === 'tarefa' && <TaskForm onDone={closeAdd} />}
      {(add === 'pensamento' || add === 'imagem') && <NoteForm kind={add} onDone={closeAdd} />}
    </Sheet>
  );
}

/* ---------------- tarefa ---------------- */
function TaskForm({ onDone }: { onDone: () => void }) {
  const addTask = useStore((s) => s.addTask);
  const stars = useStore((s) => s.tasks.filter((t) => t.date === todayISO() && t.star && !t.done && !t.dropped).length);
  const toast = useToast((s) => s.show);
  const today = todayISO();
  const [text, setText] = useState('');
  const [when, setWhen] = useState<'hoje' | 'amanha' | 'data'>('hoje');
  const [date, setDate] = useState(today);
  const [star, setStar] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => inputRef.current?.focus(), []);

  // Se a pessoa escrever "sexta", "amanhã", "dia 10"… e não escolher o dia, entendemos sozinhos.
  const parsed = useMemo(() => (text.trim() ? parseCapture(text, today) : null), [text, today]);
  const detected = when === 'hoje' && parsed && parsed.date !== today ? parsed.date : null;
  const finalDate = when === 'amanha' ? addDays(today, 1) : when === 'data' ? date : detected ?? today;

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const title = detected && parsed ? parsed.title : text.trim().replace(/\s+/g, ' ');
    const r = addTask({ title: title.charAt(0).toUpperCase() + title.slice(1), date: finalDate, dateLabel: '', time: detected ? parsed?.time : undefined, star: star && finalDate === today, waiting, area: undefined });
    toast(r.demoted ? 'Guardada. O dia já tinha três prioridades.' : finalDate === today ? 'Tarefa guardada para hoje.' : `Tarefa guardada para ${relativeLabel(finalDate, today)}.`);
    onDone();
  };

  return (
    <form className="form" onSubmit={save}>
      <label className="field">
        <span>O que precisa ser feito?</span>
        <textarea ref={inputRef} rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder="ex.: marcar consulta com a dermatologista" />
      </label>

      <fieldset className="field">
        <legend>Quando?</legend>
        <div className="pills">
          <button type="button" aria-pressed={when === 'hoje'} onClick={() => setWhen('hoje')}>Hoje</button>
          <button type="button" aria-pressed={when === 'amanha'} onClick={() => setWhen('amanha')}>Amanhã</button>
          <button type="button" aria-pressed={when === 'data'} onClick={() => setWhen('data')}>Escolher dia</button>
        </div>
        {when === 'data' && <input type="date" aria-label="Dia" min={today} value={date} onChange={(e) => setDate(e.target.value || today)} />}
        {detected && <p className="hint">Entendi que é para {relativeLabel(detected, today)}{parsed?.time ? `, às ${parsed.time}` : ''}.</p>}
      </fieldset>

      {finalDate === today && (
        <label className="toggle">
          <input type="checkbox" checked={star} disabled={!star && stars >= MAX_PRIORITIES} onChange={(e) => setStar(e.target.checked)} />
          <span>
            É uma das três prioridades de hoje
            {stars >= MAX_PRIORITIES && !star && <small> (já há três; troque uma na tela Hoje)</small>}
          </span>
        </label>
      )}
      <label className="toggle">
        <input type="checkbox" checked={waiting} onChange={(e) => setWaiting(e.target.checked)} />
        <span>Depende de outra pessoa</span>
      </label>

      <button className="btn wide" type="submit" disabled={!text.trim()}>Guardar tarefa</button>
    </form>
  );
}

/* ---------------- pensamento / imagem ---------------- */
function NoteForm({ kind, onDone }: { kind: 'pensamento' | 'imagem'; onDone: () => void }) {
  const addNote = useStore((s) => s.addNote);
  const notes = useStore((s) => s.notes);
  const toast = useToast((s) => s.show);
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');
  const [images, setImages] = useState<NoteImage[]>([]);
  const [temas, setTemas] = useState('');
  const [pasta, setPasta] = useState('');
  const [more, setMore] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const temasUsados = useMemo(() => [...new Set(notes.flatMap((n) => n.temas))].slice(0, 10), [notes]);
  const pastas = useMemo(() => [...new Set(notes.map((n) => n.pasta).filter(Boolean) as string[])], [notes]);

  useEffect(() => {
    if (kind === 'imagem') fileRef.current?.click();
    else textRef.current?.focus();
  }, [kind]);

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      const added = await Promise.all(Array.from(files).map(storeImage));
      setImages((prev) => [...prev, ...added]);
    } catch {
      toast('Não foi possível ler a imagem.');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() && !images.length) return;
    addNote({ kind: images.length ? 'referencia' : 'pensamento', title: title.trim(), body: body.trim(), images, temas: parseTemas(temas), pasta: pasta.trim() || undefined });
    toast('Guardado no Caderno.');
    onDone();
  };

  const addTema = (t: string) => setTemas((cur) => (parseTemas(cur).includes(t) ? cur : cur ? `${cur}, ${t}` : t));

  return (
    <form className="form" onSubmit={save}>
      <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />

      {(kind === 'imagem' || images.length > 0) && (
        <div className="field">
          <span>{images.length ? 'Imagens' : 'Escolha na galeria ou tire uma foto'}</span>
          <div className="thumbs">
            {images.map((img) => (
              <span key={img.id} className="thumb-edit">
                <Img img={img} />
                <button type="button" aria-label="Remover imagem" onClick={() => setImages(images.filter((i) => i.id !== img.id))}>×</button>
              </span>
            ))}
            <button type="button" className="thumb-add" onClick={() => fileRef.current?.click()} disabled={busy}>{busy ? '…' : '+'}</button>
          </div>
        </div>
      )}

      <label className="field">
        <span>{kind === 'imagem' ? 'Quer anotar algo sobre ela? (opcional)' : 'Escreva como vier'}</span>
        <textarea ref={textRef} rows={kind === 'imagem' ? 3 : 7} value={body} onChange={(e) => setBody(e.target.value)} placeholder={kind === 'imagem' ? 'de onde veio, por que guardou…' : 'Para ditar, toque no microfone do teclado.'} />
      </label>

      {kind === 'pensamento' && images.length === 0 && (
        <button type="button" className="link" onClick={() => fileRef.current?.click()}>anexar uma imagem</button>
      )}

      {!more ? (
        <button type="button" className="link" onClick={() => setMore(true)}>organizar (título, temas, pasta) — opcional</button>
      ) : (
        <div className="more">
          <input aria-label="Título" placeholder="título" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input aria-label="Temas" placeholder="temas, separados por vírgula" value={temas} onChange={(e) => setTemas(e.target.value)} />
          {temasUsados.length > 0 && (
            <p className="hint">{temasUsados.map((t) => <button key={t} type="button" className="link" onClick={() => addTema(t)}>#{t}</button>)}</p>
          )}
          <input aria-label="Pasta" placeholder="pasta" list="pastas-add" value={pasta} onChange={(e) => setPasta(e.target.value)} />
          <datalist id="pastas-add">{pastas.map((p) => <option key={p} value={p} />)}</datalist>
        </div>
      )}

      <button className="btn wide" type="submit" disabled={!body.trim() && !images.length}>Guardar no Caderno</button>
    </form>
  );
}
