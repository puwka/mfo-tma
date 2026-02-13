"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import type { MfoOffer } from "@/types";
import { useOfferUrl } from "@/hooks/useOfferUrl";
import { useReferrerStore } from "@/store/referrer";
import { useTelegramUser } from "@/hooks/useTelegramUser";

function getApprovedToday(approved_count?: number) {
  if (approved_count !== undefined) return approved_count;
  return Math.floor(Math.random() * 200) + 50;
}

export function MfoCard({
  offer,
  offerId,
}: {
  offer: MfoOffer;
  /** Если передан (uuid из БД), используется ссылка из CPA: партнёрская или default_url. */
  offerId?: string | null;
}) {
  const approvedToday = getApprovedToday(offer.approved_count);
  const resolvedUrl = offerId ? useOfferUrl(offerId) : null;
  const href = (resolvedUrl && resolvedUrl.length > 0 ? resolvedUrl : offer.url) || "#";
  const partnerTelegramId = useReferrerStore((s) => s.partnerTelegramId);
  const { user } = useTelegramUser();

  const handleClick = () => {
    if (offerId && (partnerTelegramId != null || user?.id)) {
      fetch("/api/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId,
          partnerTelegramId: partnerTelegramId ?? undefined,
          userTelegramId: user?.id,
        }),
      }).catch(() => {});
    }
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
          src={offer.logo}
          alt={offer.name}
          width={56}
          height={56}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-zinc-900 truncate">{offer.name}</h3>
          <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-amber-100 text-amber-700 border border-amber-200">
            {offer.badge}
          </span>
        </div>
        <p className="text-sm text-zinc-600 mt-0.5 whitespace-pre-line">{offer.desc}</p>
        <p className="text-xs text-amber-600 font-medium mt-1">{offer.rate}</p>
        <p className="text-xs text-zinc-500 mt-1">
          🔥 Одобрено {approvedToday} раз за сегодня
        </p>
      </div>
      <ChevronRight className="w-5 h-5 text-zinc-400 shrink-0" />
    </a>
  );
}
