'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { removeImage, storeImage } from '@/lib/images';
import { useStore, useToast } from '@/lib/store';
import { Img } from '@/components/caderno/Img';
import { noteTitle, parseTemas, shortDate } from '@/components/caderno/util';

function Nota() {
  const id = useSearchParams().get('id') ?? '';
  const router = useRouter();
  const note = useStore((s) => s.notes.find((n) => n.id === id));
  const updateNote = useStore((s) => s.updateNote);
  const deleteNote = useStore((s) => s.deleteNote);
  const toast = useToast((s) => s.show);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [temas, setTemas] = useState('');
  const [pasta, setPasta] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!note) return;
    setTitle(note.title); setBody(note.body); setTemas(note.temas.join(', ')); setPasta(note.pasta ?? '');
  }, [note, editing]);

  if (!mounted) return <div style={{ minHeight: '100dvh' }} aria-busy="true" />;

  if (!note) {
    return (
      <article className="caderno">
        <header className="front"><p className="kicker">Registro não encontrado.</p></header>
        <p className="center"><Link className="link" href="/caderno">voltar ao caderno</Link></p>
      </article>
    );
  }

  const save = () => {
    updateNote(note.id, { title: title.trim(), body: body.trim(), temas: parseTemas(temas), pasta: pasta.trim() || undefined });
    setEditing(false);
    toast('Alterações guardadas.');
  };

  const addImages = async (files: FileList | null) => {
    if (!files?.length) return;
    const added = await Promise.all(Array.from(files).map(storeImage));
    updateNote(note.id, { images: [...note.images, ...added] });
  };

  const remove = async () => {
    await Promise.all(note.images.map(removeImage));
    deleteNote(note.id);
    toast('Registro apagado.');
    router.push('/caderno');
  };

  return (
    <article className="caderno nota">
      <p className="back"><Link className="link" href="/caderno">← caderno</Link></p>
      <header className="nota-head">
        <p className="kicker">{shortDate(note.createdAt)} · {note.kind === 'referencia' ? 'referência' : 'pensamento'}{note.pasta ? ` · ${note.pasta}` : ''}</p>
        {editing ? (
          <input className="nota-title-input" aria-label="Título" placeholder="título" value={title} onChange={(e) => setTitle(e.target.value)} />
        ) : (
          <h1 className="nota-title">{noteTitle(note)}</h1>
        )}
      </header>

      {note.images.length > 0 && (
        <div className="nota-imgs">
          {note.images.map((img) => (
            <figure key={img.id}>
              <Img img={img} />
              {editing && (
                <button className="link" onClick={async () => { await removeImage(img); updateNote(note.id, { images: note.images.filter((i) => i.id !== img.id) }); }}>remover imagem</button>
              )}
            </figure>
          ))}
        </div>
      )}

      {editing ? (
        <div className="nota-edit">
          <textarea aria-label="Texto" rows={10} value={body} onChange={(e) => setBody(e.target.value)} />
          <input aria-label="Temas" placeholder="temas, separados por vírgula" value={temas} onChange={(e) => setTemas(e.target.value)} />
          <input aria-label="Pasta" placeholder="pasta (opcional)" value={pasta} onChange={(e) => setPasta(e.target.value)} />
          <label className="link file-link">
            anexar mais imagens
            <input type="file" accept="image/*" multiple hidden onChange={(e) => addImages(e.target.files)} />
          </label>
          <div className="composer-acts">
            <button className="link" onClick={() => setEditing(false)}>cancelar</button>
            <button className="btn" onClick={save}>Guardar</button>
          </div>
        </div>
      ) : (
        <>
          {note.body ? <div className="nota-body">{note.body.split('\n').map((p, i) => (p.trim() ? <p key={i}>{p}</p> : <br key={i} />))}</div> : null}
          {note.temas.length > 0 && <p className="note-temas center">{note.temas.map((t) => `#${t}`).join('  ')}</p>}
        </>
      )}

      <section className="nota-ia">
        <h2 className="section-title"><span className="mix">Elaborar</span> com o Claude</h2>
        <p className="section-note">Em breve: escolher uma instrução, enviar ao Claude e guardar cada resposta aqui, com histórico.</p>
      </section>

      {note.versions.length > 0 && (
        <section className="versions">
          <button className="link" onClick={() => setShowVersions(!showVersions)}>
            {showVersions ? 'ocultar versões anteriores' : `ver ${note.versions.length} ${note.versions.length === 1 ? 'versão anterior' : 'versões anteriores'}`}
          </button>
          {showVersions && (
            <ol>
              {note.versions.map((v, i) => (
                <li key={i}>
                  <span className="note-meta">{shortDate(v.at)}</span>
                  <p>{v.body || <em>(sem texto)</em>}</p>
                  <button className="link" onClick={() => { updateNote(note.id, { body: v.body }); toast('Versão restaurada.'); }}>restaurar esta versão</button>
                </li>
              ))}
            </ol>
          )}
        </section>
      )}

      {!editing && (
        <footer className="nota-acts">
          <button className="btn-ghost" onClick={() => setEditing(true)}>Editar</button>
          {confirmDelete ? (
            <span className="confirm">apagar de vez? <button className="link danger" onClick={remove}>sim, apagar</button> · <button className="link" onClick={() => setConfirmDelete(false)}>não</button></span>
          ) : (
            <button className="link" onClick={() => setConfirmDelete(true)}>apagar</button>
          )}
        </footer>
      )}
    </article>
  );
}

export default function NotaPage() {
  return <Suspense fallback={null}><Nota /></Suspense>;
}
