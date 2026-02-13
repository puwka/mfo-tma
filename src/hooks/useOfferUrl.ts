"use client";

import { useState, useEffect } from "react";
import { useReferrerStore } from "@/store/referrer";

/**
 * Возвращает URL для кнопки «Оформить» по offerId:
 * если есть реферер (partnerTelegramId) и у него есть custom_url на этот оффер — его ссылка,
 * иначе default_url оффера (ссылка админа).
 */
export function useOfferUrl(offerId: string | null): string {
  const partnerTelegramId = useReferrerStore((s) => s.partnerTelegramId);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!offerId) {
      setUrl("");
      return;
    }

    const params = new URLSearchParams({ offerId });
    if (partnerTelegramId != null) {
      params.set("partnerTelegramId", String(partnerTelegramId));
    }

    fetch(`/api/offer-url?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setUrl(data.url ?? ""))
      .catch(() => setUrl(""));
  }, [offerId, partnerTelegramId]);

  return url;
}
