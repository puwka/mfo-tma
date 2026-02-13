import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * ID текущего реферера (партнёра).
 * Формат из start_param: p_{telegram_id} или ref_{telegram_id}.
 * Храним telegram_id партнёра (number) для атрибуции кликов и подстановки ссылок.
 */
interface ReferrerState {
  /** Telegram ID партнёра, по чьей ссылке зашёл пользователь. null = «ничей» → дефолтная ссылка админа. */
  partnerTelegramId: number | null;
  setPartnerTelegramId: (id: number | null) => void;
  clear: () => void;
}

const COOKIE_NAME = "ref_partner_id";
const COOKIE_MAX_AGE_DAYS = 30;

function setRefCookie(telegramId: number | null) {
  if (typeof document === "undefined") return;
  const value = telegramId != null ? String(telegramId) : "";
  const maxAge = value ? COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 : 0;
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${maxAge}; samesite=lax`;
}

export const useReferrerStore = create<ReferrerState>()(
  persist(
    (set) => ({
      partnerTelegramId: null,
      setPartnerTelegramId: (id) => {
        setRefCookie(id);
        set({ partnerTelegramId: id });
      },
      clear: () => {
        setRefCookie(null);
        set({ partnerTelegramId: null });
      },
    }),
    {
      name: "referrer-storage",
      partialize: (s) => ({ partnerTelegramId: s.partnerTelegramId }),
    }
  )
);
