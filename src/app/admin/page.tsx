"use client";

import Link from "next/link";
import { Users, BarChart3, FileEdit, ArrowLeft } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">В профиль</span>
        </Link>
        <h1 className="text-xl font-bold text-zinc-900">Админ-панель</h1>
      </div>

      <section className="space-y-4 mb-8">
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Управление
        </h2>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-zinc-900">Пользователи</p>
              <p className="text-sm text-zinc-500">
                Поиск по ID/Username, смена роли (User → Partner → Admin)
              </p>
            </div>
          </div>
          <p className="text-xs text-zinc-400 mt-2">Интерфейс в разработке.</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-zinc-900">Общая статистика</p>
              <p className="text-sm text-zinc-500">
                Всего пользователей, кликов по системе
              </p>
            </div>
          </div>
          <p className="text-xs text-zinc-400 mt-2">Интеграция с таблицей clicks — в разработке.</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <FileEdit className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-zinc-900">Редактор контента</p>
              <p className="text-sm text-zinc-500">
                Добавление/скрытие офферов (МФО, кредиты, карты)
              </p>
            </div>
          </div>
          <p className="text-xs text-zinc-400 mt-2">Опционально. Работа с offers — в разработке.</p>
        </div>
      </section>
    </div>
  );
}
