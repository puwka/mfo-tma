-- Офферы: займы (mfo), кредиты (credit), карты (card)
-- data (jsonb) хранит специфичные поля для каждого типа
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('mfo', 'credit', 'card')),
  data jsonb not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.offers enable row level security;

-- Публичное чтение активных офферов (для приложения)
create policy "Allow read active offers"
  on public.offers for select
  using (is_active = true);

-- Индексы для фильтрации
create index if not exists offers_type_idx on public.offers(type);
create index if not exists offers_is_active_idx on public.offers(is_active) where is_active = true;

create trigger offers_updated_at
  before update on public.offers
  for each row execute function update_updated_at();
