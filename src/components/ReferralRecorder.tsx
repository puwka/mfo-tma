"use client";

import { useEffect, useRef } from "react";
import { useTelegramUser } from "@/hooks/useTelegramUser";
import { useReferrerStore } from "@/store/referrer";

/**
 * При заходе по партнёрской ссылке записывает referred_by в профиль текущего пользователя.
 * Вызывается один раз, когда есть и user, и partnerTelegramId.
 */
export function ReferralRecorder() {
  const { user } = useTelegramUser();
  const partnerTelegramId = useReferrerStore((s) => s.partnerTelegramId);
  const recorded = useRef(false);

  useEffect(() => {
    if (recorded.current || !user?.id || partnerTelegramId == null || user.id === partnerTelegramId) return;
    recorded.current = true;
    fetch("/api/referral/record", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-telegram-user-id": String(user.id),
      },
      body: JSON.stringify({ partnerTelegramId }),
    }).catch(() => {});
  }, [user?.id, partnerTelegramId]);

  return null;
}
