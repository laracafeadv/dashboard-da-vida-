-- Estado do Diário da Vida por usuária (tarefas, rotina, metas, agenda, dias encerrados).
-- Um documento JSON por pessoa: simples e suficiente para uso individual.
create table if not exists public.user_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.user_state enable row level security;

-- Cada pessoa só lê e grava o próprio documento.
create policy "ler o próprio estado" on public.user_state
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "criar o próprio estado" on public.user_state
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "atualizar o próprio estado" on public.user_state
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
