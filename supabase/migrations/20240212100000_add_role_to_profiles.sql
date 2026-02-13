-- Ролевая модель: user (по умолчанию), partner, admin
create type public.user_role as enum ('user', 'partner', 'admin');

alter table public.profiles
  add column if not exists app_role public.user_role not null default 'user';

comment on column public.profiles.app_role is 'Роль пользователя: user, partner, admin';
