create table if not exists public.cargos (
  supabase_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('cliente', 'colaborador')),
  sub_role text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cargos_role_idx on public.cargos (role);

alter table public.cargos enable row level security;

create policy "Cargos: user can read own role"
  on public.cargos
  for select
  using (auth.uid() = supabase_id);

create or replace function public.set_cargos_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger cargos_set_updated_at
before update on public.cargos
for each row execute function public.set_cargos_updated_at();
