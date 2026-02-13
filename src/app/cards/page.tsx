"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { useOfferUrl } from "@/hooks/useOfferUrl";
import { useReferrerStore } from "@/store/referrer";
import { useTelegramUser } from "@/hooks/useTelegramUser";
import { ChevronRight } from "lucide-react";

interface OfferRow {
  id: string;
  type: string;
  data: Record<string, unknown>;
  default_url?: string | null;
}

export default function CardsPage() {
  const [offers, setOffers] = useState<OfferRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/offers")
      .then((r) => r.json())
      .then((data: OfferRow[]) => setOffers(Array.isArray(data) ? data : []))
      .catch(() => setOffers([]))
      .finally(() => setLoading(false));
  }, []);

  const cards = offers.filter((o) => o.type === "card");

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <PageHeader
        title="Карты"
        subtitle="Кредитные карты с льготным периодом"
      />
      {loading ? (
        <div className="card-base p-8 text-center mt-4">
          <p className="text-zinc-500">Загрузка…</p>
        </div>
      ) : cards.length === 0 ? (
        <p className="text-zinc-500 text-sm mt-4">
          Пока нет офферов. Админ добавит карты в каталог.
        </p>
      ) : (
        <div className="space-y-3 mt-4">
          {cards.map((row) => (
            <CardOfferCard key={row.id} row={row} />
          ))}
        </div>
      )}
    </div>
  );
}

function CardOfferCard({ row }: { row: OfferRow }) {
  const d = row.data as Record<string, unknown>;
  const name = (d.name as string) ?? "Карта";
  const grace_days = Number(d.grace_days) ?? 0;
  const cashback = (d.cashback as string) ?? "";
  const service_fee = (d.service_fee as string) ?? "";
  const credit_limit = (d.credit_limit as string) ?? "";
  const badge = (d.badge as string) ?? "";
  const logo = (d.bank_logo as string) || "https://placehold.co/56x56?text=Card";
  const url = useOfferUrl(row.id);
  const href = (url && url.length > 0 ? url : row.default_url) || "#";
  const partnerTelegramId = useReferrerStore((s) => s.partnerTelegramId);
  const { user } = useTelegramUser();

  const handleClick = () => {
    fetch("/api/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        offerId: row.id,
        partnerTelegramId: partnerTelegramId ?? undefined,
        userTelegramId: user?.id,
      }),
    }).catch(() => {});
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="card-base p-4 flex gap-4 items-center block animate-in hover:border-amber-400"
    >
      <div className="shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-zinc-100">
        <Image
          src={logo}
          alt={name}
          width={56}
          height={56}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-zinc-900 truncate">{name}</h3>
          {badge && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-amber-100 text-amber-700 border border-amber-200">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-zinc-600 mt-0.5">
          Льготный период до {grace_days} дн.
          {cashback && ` · ${cashback}`}
        </p>
        {(service_fee || credit_limit) && (
          <p className="text-xs text-zinc-500 mt-1">
            {service_fee && `Обслуживание: ${service_fee}`}
            {service_fee && credit_limit && " · "}
            {credit_limit && `Лимит: ${credit_limit}`}
          </p>
        )}
      </div>
      <ChevronRight className="w-5 h-5 text-zinc-400 shrink-0" />
    </a>
  );
}
