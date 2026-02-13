"use client";

import { useState, useEffect, useCallback } from "react";
import type { Profile, TelegramUser } from "@/types/profile";

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: { user?: TelegramUser; start_param?: string };
        ready: () => void;
        showPopup?: (params: { title?: string; message?: string }) => void;
      };
    };
  }
}

export function useTelegramUser() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const syncProfile = useCallback(async (tgUser: TelegramUser) => {
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: tgUser }),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        // Cookie для middleware (защита /admin)
        if (data?.app_role && typeof document !== "undefined") {
          document.cookie = `app_role=${data.app_role}; path=/; max-age=86400; samesite=lax`;
        }
      }
    } catch {
      // Игнорируем ошибки синхронизации
    }
  }, []);

  useEffect(() => {
    const tg = typeof window !== "undefined" ? window.Telegram?.WebApp : null;
    if (!tg) {
      setLoading(false);
      return;
    }

    tg.ready();
    const tgUser = tg.initDataUnsafe?.user;

    if (tgUser) {
      setUser(tgUser);
      syncProfile(tgUser).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [syncProfile]);

  const fullName =
    user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : user?.first_name ?? "Гость";

  const initials =
    user?.first_name?.[0]?.toUpperCase() ?? "?";

  const role = profile?.app_role ?? "user";

  const refetch = useCallback(() => {
    if (user) syncProfile(user);
  }, [user, syncProfile]);

  return {
    user,
    profile,
    loading,
    fullName,
    initials,
    photoUrl: user?.photo_url ?? profile?.photo_url ?? null,
    role,
    refetch,
  };
}
