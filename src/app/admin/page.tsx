"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  BarChart3,
  FileEdit,
  ArrowLeft,
  Search,
  Loader2,
  Check,
  X,
  RefreshCw,
} from "lucide-react";
import { useTelegramUser } from "@/hooks/useTelegramUser";
import type { UserRole } from "@/types/offers";
import type { OfferRow } from "@/types/offers";

function getAdminHeaders(telegramId: number | undefined): HeadersInit {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (telegramId != null) h["x-telegram-user-id"] = String(telegramId);
  return h;
}

function offerName(row: { data?: { name?: string }; type: string }): string {
  return (row.data as { name?: string } | undefined)?.name ?? row.type;
}

export default function AdminPage() {
  const { user, loading: userLoading } = useTelegramUser();
  const telegramId = user?.id;

  const [stats, setStats] = useState<{ usersCount: number; clicksCount: number } | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [users, setUsers] = useState<Array<{ id: string; telegram_id: number; username: string | null; first_name: string | null; last_name: string | null; app_role: UserRole; created_at: string }>>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [roleDraft, setRoleDraft] = useState<Record<string, UserRole>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [offers, setOffers] = useState<OfferRow[]>([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"stats" | "users" | "offers">("stats");

  const fetchStats = useCallback(async () => {
    if (!telegramId) return;
    setStatsLoading(true);
    try {
      const res = await fetch("/api/admin/stats", {
        headers: getAdminHeaders(telegramId),
      });
      if (res.ok) {
        const data = await res.json();
        setStats({ usersCount: data.usersCount, clicksCount: data.clicksCount });
      }
    } finally {
      setStatsLoading(false);
    }
  }, [telegramId]);

  const fetchUsers = useCallback(async () => {
    if (!telegramId) return;
    setUsersLoading(true);
    try {
      const url = userSearch ? `/api/admin/users?q=${encodeURIComponent(userSearch)}` : "/api/admin/users";
      const res = await fetch(url, { headers: getAdminHeaders(telegramId) });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        setRoleDraft({});
      }
    } finally {
      setUsersLoading(false);
    }
  }, [telegramId, userSearch]);

  const fetchOffers = useCallback(async () => {
    if (!telegramId) return;
    setOffersLoading(true);
    try {
      const res = await fetch("/api/admin/offers", { headers: getAdminHeaders(telegramId) });
      if (res.ok) {
        const data = await res.json();
        setOffers(data);
      }
    } finally {
      setOffersLoading(false);
    }
  }, [telegramId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
  }, [activeTab, fetchUsers]);

  useEffect(() => {
    if (activeTab === "offers") fetchOffers();
  }, [activeTab, fetchOffers]);

  const handleSaveRole = async (profileId: string, app_role: UserRole) => {
    if (!telegramId) return;
    setSavingId(profileId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: getAdminHeaders(telegramId),
        body: JSON.stringify({ profileId, app_role }),
      });
      if (res.ok) {
        setRoleDraft((prev) => {
          const next = { ...prev };
          delete next[profileId];
          return next;
        });
        setUsers((prev) => prev.map((u) => (u.id === profileId ? { ...u, app_role } : u)));
      }
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleOffer = async (offerId: string, is_active: boolean) => {
    if (!telegramId) return;
    setTogglingId(offerId);
    try {
      const res = await fetch("/api/admin/offers", {
        method: "PATCH",
        headers: getAdminHeaders(telegramId),
        body: JSON.stringify({ offerId, is_active }),
      });
      if (res.ok) {
        setOffers((prev) => prev.map((o) => (o.id === offerId ? { ...o, is_active } : o)));
      }
    } finally {
      setTogglingId(null);
    }
  };

  const getEffectiveRole = (u: { id: string; app_role: UserRole }) => roleDraft[u.id] ?? u.app_role;

  if (userLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 pb-24 flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

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

      {/* Табы */}
      <div className="flex gap-2 mb-6 rounded-xl bg-zinc-100 p-1">
        {(["stats", "users", "offers"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {tab === "stats" && "Статистика"}
            {tab === "users" && "Пользователи"}
            {tab === "offers" && "Офферы"}
          </button>
        ))}
      </div>

      {/* Статистика */}
      {activeTab === "stats" && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Общая статистика
            </h2>
            <button
              type="button"
              onClick={() => fetchStats()}
              disabled={statsLoading}
              className="p-2 text-zinc-500 hover:text-amber-600 disabled:opacity-50"
              aria-label="Обновить"
            >
              <RefreshCw className={`w-4 h-4 ${statsLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
          {statsLoading ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
                <div className="flex items-center gap-2 text-amber-700 mb-1">
                  <Users className="w-5 h-5" />
                  <span className="text-xs font-semibold uppercase">Пользователи</span>
                </div>
                <p className="text-2xl font-bold text-zinc-900">{stats.usersCount}</p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
                <div className="flex items-center gap-2 text-amber-700 mb-1">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-xs font-semibold uppercase">Клики</span>
                </div>
                <p className="text-2xl font-bold text-zinc-900">{stats.clicksCount}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">Не удалось загрузить статистику.</p>
          )}
        </section>
      )}

      {/* Пользователи */}
      {activeTab === "users" && (
        <section className="space-y-4">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Управление пользователями
          </h2>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Telegram ID или username..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <button
              type="button"
              onClick={() => fetchUsers()}
              disabled={usersLoading}
              className="btn-accent px-4 py-2.5 rounded-xl text-sm shrink-0 disabled:opacity-50"
            >
              {usersLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Найти"}
            </button>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
            {usersLoading && users.length === 0 ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
              </div>
            ) : users.length === 0 ? (
              <p className="p-6 text-sm text-zinc-500 text-center">
                {userSearch ? "Никого не найдено." : "Введите запрос и нажмите «Найти»."}
              </p>
            ) : (
              <div className="divide-y divide-zinc-100 overflow-x-auto">
                {users.map((u) => {
                  const effective = getEffectiveRole(u);
                  const changed = effective !== u.app_role;
                  return (
                    <div
                      key={u.id}
                      className="p-4 flex flex-wrap items-center gap-3 hover:bg-zinc-50/50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-zinc-900 truncate">
                          {u.first_name} {u.last_name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          @{u.username ?? "—"} · ID {u.telegram_id}
                        </p>
                      </div>
                      <select
                        value={effective}
                        onChange={(e) => setRoleDraft((prev) => ({ ...prev, [u.id]: e.target.value as UserRole }))}
                        className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      >
                        <option value="user">User</option>
                        <option value="partner">Partner</option>
                        <option value="admin">Admin</option>
                      </select>
                      {changed && (
                        <button
                          type="button"
                          onClick={() => handleSaveRole(u.id, effective)}
                          disabled={savingId === u.id}
                          className="inline-flex items-center gap-1 rounded-lg bg-amber-500 text-zinc-900 px-3 py-1.5 text-sm font-medium hover:bg-amber-400 disabled:opacity-50"
                        >
                          {savingId === u.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                          Сохранить
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Офферы */}
      {activeTab === "offers" && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Редактор офферов
            </h2>
            <button
              type="button"
              onClick={() => fetchOffers()}
              disabled={offersLoading}
              className="p-2 text-zinc-500 hover:text-amber-600 disabled:opacity-50"
              aria-label="Обновить"
            >
              <RefreshCw className={`w-4 h-4 ${offersLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
            {offersLoading && offers.length === 0 ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
              </div>
            ) : offers.length === 0 ? (
              <p className="p-6 text-sm text-zinc-500 text-center">
                Офферов пока нет. Добавьте через Supabase или API.
              </p>
            ) : (
              <div className="divide-y divide-zinc-100">
                {offers.map((o) => (
                  <div
                    key={o.id}
                    className="p-4 flex items-center justify-between gap-3 hover:bg-zinc-50/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-zinc-900 truncate">{offerName(o)}</p>
                      <p className="text-xs text-zinc-500">
                        {o.type} · {o.is_active ? "Активен" : "Скрыт"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleOffer(o.id, !o.is_active)}
                      disabled={togglingId === o.id}
                      className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${
                        o.is_active
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : "bg-zinc-200 text-zinc-600 hover:bg-zinc-300"
                      } disabled:opacity-50`}
                    >
                      {togglingId === o.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : o.is_active ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      {o.is_active ? "Скрыть" : "Показать"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-zinc-400">
            Добавление новых офферов — через Supabase Dashboard или POST /api/admin/offers (type, data).
          </p>
        </section>
      )}
    </div>
  );
}
