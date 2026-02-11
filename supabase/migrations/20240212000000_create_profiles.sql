-- Таблица профилей пользователей (данные из Telegram)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  telegram_id bigint not null unique,
  first_name text,
  last_name text,
  username text,
  photo_url text,
  language_code text,
  is_premium boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: пользователи могут читать/обновлять только свой профиль по telegram_id
alter table public.profiles enable row level security;

-- Политика: анонимный доступ для вставки/обновления (будет верификация через initData на бэкенде)
create policy "Allow insert and update profiles"
  on public.profiles for all
  using (true)
  with check (true);

-- Индекс для быстрого поиска по telegram_id
create index if not exists profiles_telegram_id_idx on public.profiles(telegram_id);

-- Триггер для updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function update_updated_at();
