"use client";

import { useReferrer } from "@/hooks/useReferrer";

/**
 * Монтируется в layout; обрабатывает start_param из Telegram и сохраняет ID партнёра в store.
 * Рендерит ничего.
 */
export function ReferrerInit() {
  useReferrer();
  return null;
}
