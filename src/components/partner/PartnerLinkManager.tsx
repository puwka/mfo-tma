"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Link2 } from "lucide-react";

const getHeaders = (telegramId: number | undefined): HeadersInit => {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (telegramId != null) h["x-telegram-user-id"] = String(telegramId);
  return h;
};

interface PartnerOffer {
  id: string;
  type: string;
  data: { name?: string };
  default_url: string | null;
  custom_url: string;
}

export function PartnerLinkManager({ telegramId }: { telegramId: number | undefined }) {
  const [offers, setOffers] = useState<PartnerOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchOffers = useCallback(async () => {
    if (!telegramId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/partner/offers", { headers: getHeaders(telegramId) });
      if (res.ok) {
        const data = await res.json();
        setOffers(data);
        setDraft({});
      }
    } finally {
      setLoading(false);
    }
  }, [telegramId]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const handleSave = async (offerId: string, custom_url: string) => {
    if (!telegramId) return;
    setSavingId(offerId);
    try {
      const res = await fetch("/api/partner/links", {
        method: "PUT",
        headers: getHeaders(telegramId),
        body: JSON.stringify({ offerId, custom_url }),
      });
      if (res.ok) {
        setOffers((prev) => prev.map((o) => (o.id === offerId ? { ...o, custom_url } : o)));
        setDraft((p) => {
          const next = { ...p };
          delete next[offerId];
          return next;
        });
      }
    } finally {
      setSavingId(null);
    }
  };

  const name = (o: PartnerOffer) => (o.data?.name as string) ?? o.type;

  if (loading) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <p className="text-sm text-zinc-500 rounded-2xl border border-zinc-200 bg-white p-4">
        Нет активных офферов. Админ добавит офферы в каталог.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {offers.map((o) => {
        const value = draft[o.id] ?? o.custom_url ?? "";
        const changed = value !== (o.custom_url ?? "");
        return (
          <div
            key={o.id}
            className="rounded-2xl border border-zinc-200 bg-white p-4 space-y-2"
          >
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="font-medium text-zinc-900 truncate">{name(o)}</span>
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                value={value}
                onChange={(e) => setDraft((p) => ({ ...p, [o.id]: e.target.value }))}
                placeholder="Твоя реферальная ссылка (Admitad, Leads.su…)"
                className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              {changed && (
                <button
                  type="button"
                  onClick={() => handleSave(o.id, value)}
                  disabled={savingId === o.id}
                  className="shrink-0 rounded-xl bg-amber-500 text-zinc-900 px-4 py-2.5 text-sm font-semibold hover:bg-amber-400 disabled:opacity-50 flex items-center gap-1"
                >
                  {savingId === o.id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Сохранить
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
