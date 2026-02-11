# MFO-TMA

Приложение для подбора займов, брокеров и статей о финансах (Telegram Mini App).

## Стек

- Next.js 16 (App Router)
- React 19
- Supabase (профили пользователей)
- Tailwind CSS 4
- Framer Motion

## Локальная разработка

1. Установите зависимости:

```bash
npm install
```

2. Скопируйте переменные окружения:

```bash
cp .env.example .env.local
```

Заполните в `.env.local` значения из [Supabase Dashboard](https://supabase.com/dashboard) → ваш проект → Settings → API.

3. Запустите dev-сервер:

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Деплой на Vercel

### Через Vercel Dashboard

1. Импортируйте репозиторий: [vercel.com/new](https://vercel.com/new).
2. Выберите этот репозиторий (GitHub/GitLab/Bitbucket).
3. **Environment Variables** — добавьте:
   - `NEXT_PUBLIC_SUPABASE_URL` — URL проекта Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon/public key Supabase  
   При необходимости для API с повышенными правами:
   - `SUPABASE_SERVICE_ROLE_KEY` — service role key (опционально)
4. Нажмите **Deploy**. Vercel сам определит Next.js и выполнит `npm run build`.

### Через Vercel CLI

```bash
npm i -g vercel
vercel
```

При первом запуске привяжите проект и укажите переменные окружения в [Dashboard](https://vercel.com/dashboard) → проект → Settings → Environment Variables.

### Важно

- Переменные с префиксом `NEXT_PUBLIC_` доступны в браузере; не помещайте в них секреты.
- `SUPABASE_SERVICE_ROLE_KEY` не имеет префикса `NEXT_PUBLIC_` и доступен только на сервере.
- После деплоя при необходимости настройте домен и HTTPS в настройках проекта Vercel.

## Скрипты

| Команда   | Описание           |
|----------|--------------------|
| `npm run dev`   | Запуск dev-сервера |
| `npm run build` | Сборка для продакшена |
| `npm run start` | Запуск продакшен-сервера |
| `npm run lint`  | Проверка ESLint    |

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Deploying Next.js on Vercel](https://nextjs.org/docs/app/building-your-application/deploying)
- [Supabase Docs](https://supabase.com/docs)
