-- Downloadtelling van de technische fiches op de ZAS-pagina (toegepast op 2026-11-20).
create table if not exists public.zas_document_events (
  id bigint generated always as identity primary key,
  document_id uuid not null references public.zas_documents(id) on delete cascade,
  kind text not null check (kind in ('view','download')),
  created_at timestamptz not null default now()
);
create index if not exists zas_document_events_doc_time on public.zas_document_events (document_id, created_at);
create index if not exists zas_document_events_time on public.zas_document_events (created_at);
alter table public.zas_document_events enable row level security;

-- Aantal per fiche deze maand en dit jaar, volgens de Belgische kalender.
create or replace function public.zas_download_stats()
returns table(document_id uuid, this_month bigint, this_year bigint)
language sql stable set search_path = public as $$
  select e.document_id,
         count(*) filter (where e.created_at >= (date_trunc('month', now() at time zone 'Europe/Brussels') at time zone 'Europe/Brussels')),
         count(*)
  from public.zas_document_events e
  where e.created_at >= (date_trunc('year', now() at time zone 'Europe/Brussels') at time zone 'Europe/Brussels')
  group by e.document_id
$$;
revoke execute on function public.zas_download_stats() from public, anon, authenticated;
grant execute on function public.zas_download_stats() to service_role;
