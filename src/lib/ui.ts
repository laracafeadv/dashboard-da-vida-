'use client';
import { create } from 'zustand';

export type AddKind = 'tarefa' | 'pensamento' | 'imagem';

/** Estado das janelas (não é salvo). */
interface UI {
  add: AddKind | 'escolher' | null;
  taskId: string | null;
  openAdd: (k?: AddKind) => void;
  closeAdd: () => void;
  openTask: (id: string) => void;
  closeTask: () => void;
}

export const useUI = create<UI>((set) => ({
  add: null,
  taskId: null,
  openAdd: (k) => set({ add: k ?? 'escolher' }),
  closeAdd: () => set({ add: null }),
  openTask: (id) => set({ taskId: id }),
  closeTask: () => set({ taskId: null }),
}));
