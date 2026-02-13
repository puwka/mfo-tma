-- Клики по офферам (для статистики партнёров и админа)
-- user_id — кто кликнул (profiles.id по telegram_id)
-- partner_id — чья реферальная ссылка (если переход по партнёрской ссылке)
create table if not exists public.clicks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  offer_id uuid references public.offers(id) on delete cascade not null,
  partner_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.clicks enable row level security;

-- Вставка клика с фронта (anon). Чтение — только через API с service_role.
create policy "Allow insert clicks"
  on public.clicks for insert
  with check (true);

-- Индексы для аналитики
create index if not exists clicks_created_at_idx on public.clicks(created_at);
create index if not exists clicks_partner_id_idx on public.clicks(partner_id);
create index if not exists clicks_offer_id_idx on public.clicks(offer_id);
create index if not exists clicks_user_id_idx on public.clicks(user_id);
