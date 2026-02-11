# Supabase: миграции

## Применение миграции

1. Установите Supabase CLI: `npm i -g supabase`
2. Войдите: `supabase login`
3. Свяжите проект: `supabase link --project-ref YOUR_PROJECT_REF`
4. Примените миграции: `supabase db push`

Или выполните SQL вручную в Supabase Dashboard → SQL Editor:

```sql
-- Скопируйте содержимое файла migrations/20240212000000_create_profiles.sql
```
