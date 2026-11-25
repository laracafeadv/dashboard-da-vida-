import { MONTHS } from '@/lib/dates';
import type { Note } from '@/lib/types';

export const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export const parseTemas = (s: string) =>
  Array.from(new Set(s.split(/[,#]/).map((t) => t.trim().toLowerCase()).filter(Boolean)));

export function shortDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return `hoje, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  const y = d.getFullYear() === now.getFullYear() ? '' : ` de ${d.getFullYear()}`;
  return `${d.getDate()} de ${MONTHS[d.getMonth()]}${y}`;
}

export function noteTitle(n: Note) {
  if (n.title.trim()) return n.title.trim();
  const first = n.body.trim().split('\n')[0];
  if (first) return first.length > 70 ? first.slice(0, 68) + '…' : first;
  return n.kind === 'referencia' ? 'Referência sem título' : 'Pensamento sem título';
}

export function matches(n: Note, q: string) {
  if (!q.trim()) return true;
  const hay = norm([n.title, n.body, n.temas.join(' '), n.pasta ?? ''].join(' '));
  return norm(q).split(/\s+/).every((w) => hay.includes(w));
}
