-- =====================================================================
-- D-mealz  |  Supabase schema
-- Run once: Supabase Dashboard > SQL Editor > New query > paste > Run
-- =====================================================================
-- The app keeps all shared data (votes, surplus alerts, feedback, chat,
-- attendance, accounts, profiles ...) as JSON documents in ONE table.
-- `coll` = collection name, `id` = record key, `data` = the JSON record.

create table if not exists public.records (
  coll        text        not null,
  id          text        not null,
  data        jsonb       not null,
  updated_at  timestamptz not null default now(),
  primary key (coll, id),

  -- only the collections the app actually uses
  constraint records_coll_ok check (coll in (
    'sent','fb','msgs','notes','dmsg','conf','chat','reqs',
    'att','ov','pick','prof','acc','votes','vw')),
  -- basic abuse guard: 200 KB max per record
  constraint records_size_ok check (pg_column_size(data) < 200000)
);

create index if not exists records_coll_idx on public.records (coll);

-- keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists records_touch on public.records;
create trigger records_touch before update on public.records
for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- Row Level Security
-- The app signs users in itself (no Supabase Auth), so the browser talks
-- to Supabase with the public anon key. These policies allow exactly
-- that. See README "Security" before using with real people's data.
-- ---------------------------------------------------------------------
alter table public.records enable row level security;

drop policy if exists "records read"   on public.records;
drop policy if exists "records insert" on public.records;
drop policy if exists "records update" on public.records;
drop policy if exists "records delete" on public.records;

create policy "records read"   on public.records for select to anon, authenticated using (true);
create policy "records insert" on public.records for insert to anon, authenticated with check (true);
create policy "records update" on public.records for update to anon, authenticated using (true) with check (true);
create policy "records delete" on public.records for delete to anon, authenticated using (true);

-- ---------------------------------------------------------------------
-- Realtime (live updates between devices)
-- ---------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'records'
  ) then
    alter publication supabase_realtime add table public.records;
  end if;
end $$;