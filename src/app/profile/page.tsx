"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Shield,
  Sparkles,
  ChevronRight,
  BarChart3,
  Settings,
  Headphones,
  Heart,
} from "lucide-react";
import { useTelegramUser } from "@/hooks/useTelegramUser";
import { RoleGuard } from "@/components/RoleGuard";

const CTAS = [
  {
    icon: TrendingUp,
    title: "Отличная кредитная история",
    desc: "Вы вовремя погашаете займы. Продолжайте в том же духе.",
    accent: "emerald",
  },
  {
    icon: Shield,
    title: "Надёжный заёмщик",
    desc: "МФО доверяют вам. Шанс одобрения выше среднего.",
    accent: "amber",
  },
  {
    icon: Sparkles,
    title: "Выгодные предложения",
    desc: "Подберите займ под 0% на первый раз в разделе Займы.",
    accent: "blue",
  },
];

const accentStyles: Record<string, string> = {
  emerald: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  amber: "bg-amber-500/10 text-amber-700 border-amber-200",
  blue: "bg-blue-500/10 text-blue-700 border-blue-200",
};

// Мок-статистика для партнёра
const PARTNER_STATS = [
  { offer: "Займ MoneyMan", clicks: 124, conversions: 18 },
  { offer: "Займ ZAYMIGO", clicks: 89, conversions: 12 },
  { offer: "Кредит Тинькофф", clicks: 56, conversions: 5 },
];

export default function ProfilePage() {
  const { fullName, photoUrl, initials, loading, role, profile } = useTelegramUser();
  const [avatarLoaded, setAvatarLoaded] = useState(false);

  useEffect(() => {
    setAvatarLoaded(false);
  }, [photoUrl]);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
        <div className="h-5 w-20 bg-zinc-200 rounded mb-8 animate-pulse" />
        <div className="rounded-2xl bg-zinc-100 p-6 mb-6">
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-full shrink-0 flex items-center justify-center bg-amber-100 border-2 border-amber-200">
              <div className="w-8 h-8 rounded-full border-2 border-amber-300 border-t-amber-600 animate-spin" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-6 w-32 bg-zinc-200 rounded animate-pulse" />
              <div className="h-4 w-24 bg-zinc-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-zinc-900">Профиль</h1>
      </div>

      {/* Блок профиля: аватар, имя, user_id */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/60 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-white shadow-sm border-2 border-amber-200/80 flex items-center justify-center shrink-0 ring-2 ring-amber-100">
            {photoUrl ? (
              <>
                <Image
                  src={photoUrl}
                  alt={fullName}
                  width={80}
                  height={80}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${avatarLoaded ? "opacity-100" : "opacity-0"}`}
                  onLoad={() => setAvatarLoaded(true)}
                />
                <AnimatePresence mode="wait">
                  {!avatarLoaded && (
                    <motion.div
                      key="avatar-skeleton"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 flex items-center justify-center bg-amber-100"
                    >
                      <div
                        className="w-8 h-8 rounded-full border-2 border-amber-300 border-t-amber-600 animate-spin"
                        aria-hidden
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <span className="text-2xl font-bold text-amber-600">{initials}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-zinc-900 truncate">{fullName}</h2>
            <p className="text-sm text-zinc-500 mt-0.5">Профиль в Telegram</p>
            {profile?.id && (
              <p className="text-xs text-zinc-400 mt-1 font-mono">ID: {profile.id.slice(0, 8)}…</p>
            )}
          </div>
        </div>
      </div>

      {/* Партнёр: дашборд */}
      <RoleGuard allow="partner" currentRole={role} fallback={null}>
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
            Дашборд партнёра
          </h2>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-3">
            <div className="flex items-center gap-2 text-amber-700 font-semibold">
              <BarChart3 className="w-5 h-5" />
              Статистика по реферальным ссылкам
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-zinc-500 border-b border-amber-200">
                    <th className="py-2 pr-2">Оффер</th>
                    <th className="py-2 pr-2">Переходы</th>
                    <th className="py-2">Конверсия</th>
                  </tr>
                </thead>
                <tbody>
                  {PARTNER_STATS.map((row) => (
                    <tr key={row.offer} className="border-b border-amber-100">
                      <td className="py-2 pr-2 font-medium text-zinc-900">{row.offer}</td>
                      <td className="py-2 pr-2">{row.clicks}</td>
                      <td className="py-2">{row.conversions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-zinc-500">Мок-данные. Интеграция с clicks — в разработке.</p>
          </div>
        </section>
      </RoleGuard>

      {/* Админ: ссылка в админ-панель */}
      <RoleGuard allow="admin" currentRole={role} fallback={null}>
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
            Администрирование
          </h2>
          <Link
            href="/admin"
            className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 hover:bg-zinc-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Settings className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-zinc-900">Панель администратора</p>
                <p className="text-sm text-zinc-500">Управление пользователями и статистика</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-400" />
          </Link>
        </section>
      </RoleGuard>

      {/* Общее: статус (User) */}
      <section>
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
          Ваш статус
        </h2>
        <div className="space-y-3">
          {CTAS.map((cta) => (
            <div
              key={cta.title}
              className={`rounded-2xl border p-4 ${accentStyles[cta.accent]} transition-shadow hover:shadow-sm`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center shrink-0">
                  <cta.icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-zinc-900">{cta.title}</h3>
                  <p className="text-sm text-zinc-600 mt-1 leading-relaxed">{cta.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-400 shrink-0 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Избранное / История (User) — заглушка */}
      <section className="mt-8">
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
          Разделы
        </h2>
        <div className="space-y-2">
          <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 text-zinc-500">
            <Heart className="w-5 h-5 shrink-0" />
            <span className="text-sm">Избранное — в разработке</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 text-zinc-500">
            <BarChart3 className="w-5 h-5 shrink-0" />
            <span className="text-sm">История кликов — в разработке</span>
          </div>
        </div>
      </section>

      {/* Контакты поддержки */}
      <section className="mt-8">
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
          Поддержка
        </h2>
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
          <Headphones className="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <p className="font-medium text-zinc-900">Служба поддержки</p>
            <p className="text-sm text-zinc-500">Напишите в Telegram: @support</p>
          </div>
        </div>
      </section>

      <div className="mt-8">
        <Link
          href="/"
          className="btn-accent flex items-center justify-center gap-2 w-full py-4"
        >
          Подобрать займ
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
