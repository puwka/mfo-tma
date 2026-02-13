-- Дефолтная ссылка админа для оффера (если партнёр не указал свою)
alter table public.offers
  add column if not exists default_url text;

comment on column public.offers.default_url is 'Ссылка админа по умолчанию для кнопки «Оформить»';

-- Кто привёл пользователя (реферер)
alter table public.profiles
  add column if not exists referred_by uuid references public.profiles(id) on delete set null;

comment on column public.profiles.referred_by is 'Профиль партнёра, по ссылке которого пришёл пользователь';

-- Связка Партнер–Оффер: своя ссылка партнёра на оффер
create table if not exists public.partner_links (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.profiles(id) on delete cascade,
  offer_id uuid not null references public.offers(id) on delete cascade,
  custom_url text not null default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(partner_id, offer_id)
);

alter table public.partner_links enable row level security;

create policy "Allow insert partner_links"
  on public.partner_links for insert
  with check (true);

create policy "Allow update partner_links"
  on public.partner_links for update
  using (true)
  with check (true);

create policy "Allow select partner_links"
  on public.partner_links for select
  using (true);

create index if not exists partner_links_partner_id_idx on public.partner_links(partner_id);
create index if not exists partner_links_offer_id_idx on public.partner_links(offer_id);

create trigger partner_links_updated_at
  before update on public.partner_links
  for each row execute function update_updated_at();
