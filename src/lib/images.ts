'use client';
import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { NoteImage } from './types';

const BUCKET = 'caderno';
const MAX = 1600;

const uid = () => Math.random().toString(36).slice(2, 10);

/** Reduz a imagem (prints e fotos do iPhone podem ter vários MB) para no máximo 1600 px, em JPEG. */
async function compress(file: File): Promise<{ blob: Blob; w: number; h: number }> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, MAX / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * scale);
  const h = Math.round(bmp.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, w, h);
  const blob = await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('falha ao comprimir'))), 'image/jpeg', 0.82));
  return { blob, w, h };
}

const toDataUrl = (blob: Blob) =>
  new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(blob);
  });

/** Guarda a imagem: na nuvem quando há sessão; senão, no próprio registro. */
export async function storeImage(file: File): Promise<NoteImage> {
  const { blob, w, h } = await compress(file);
  const id = uid();
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (user) {
      const path = `${user.id}/${id}.jpg`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: 'image/jpeg' });
      if (!error) return { id, src: path, cloud: true, w, h };
    }
  }
  return { id, src: await toDataUrl(blob), w, h };
}

export async function removeImage(img: NoteImage) {
  if (img.cloud && supabase) await supabase.storage.from(BUCKET).remove([img.src]);
}

/** Endereço exibível da imagem (links da nuvem são temporários e assinados). */
export function useImageUrl(img: NoteImage) {
  const [url, setUrl] = useState(img.cloud ? '' : img.src);
  useEffect(() => {
    if (!img.cloud || !supabase) return;
    let alive = true;
    supabase.storage.from(BUCKET).createSignedUrl(img.src, 60 * 60).then(({ data }) => { if (alive && data) setUrl(data.signedUrl); });
    return () => { alive = false; };
  }, [img.cloud, img.src]);
  return url;
}
