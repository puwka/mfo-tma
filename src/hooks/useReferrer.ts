"use client";

import { useEffect, useRef } from "react";
import { useReferrerStore } from "@/store/referrer";

const PREFIX_P = "p_";
const PREFIX_REF = "ref_";

/**
 * Парсит start_param из Telegram: p_{telegram_id} или ref_{telegram_id}.
 * Возвращает telegram_id партнёра или null.
 */
function parseStartParam(startParam: string | undefined): number | null {
  if (!startParam || typeof startParam !== "string") return null;
  const trimmed = startParam.trim();
  let idStr: string | null = null;
  if (trimmed.startsWith(PREFIX_P)) idStr = trimmed.slice(PREFIX_P.length);
  else if (trimmed.startsWith(PREFIX_REF)) idStr = trimmed.slice(PREFIX_REF.length);
  if (!idStr) return null;
  const id = parseInt(idStr, 10);
  return Number.isNaN(id) ? null : id;
}

/**
 * Обрабатывает входящий start_param из Telegram SDK и сохраняет ID партнёра в store + cookie.
 * Вызывать один раз при загрузке приложения (например, в layout или главной странице).
 */
export function useReferrer() {
  const setPartnerTelegramId = useReferrerStore((s) => s.setPartnerTelegramId);
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    let partnerId: number | null = null;

    const tg = typeof window !== "undefined" ? window.Telegram?.WebApp : null;
    const startParam = tg?.initDataUnsafe?.start_param;
    partnerId = parseStartParam(startParam);

    if (partnerId == null && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const fromUrl = params.get("startapp") ?? params.get("ref");
      partnerId = parseStartParam(fromUrl ?? undefined);
    }

    if (partnerId != null) {
      setPartnerTelegramId(partnerId);
      processed.current = true;
    }
  }, [setPartnerTelegramId]);

  const partnerTelegramId = useReferrerStore((s) => s.partnerTelegramId);
  const setPartnerTelegramIdFn = useReferrerStore((s) => s.setPartnerTelegramId);
  const clearFn = useReferrerStore((s) => s.clear);

  return {
    partnerTelegramId,
    setPartnerTelegramId: setPartnerTelegramIdFn,
    clear: clearFn,
  };
}
