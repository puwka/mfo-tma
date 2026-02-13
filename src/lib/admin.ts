import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Profile } from "@/types/profile";

const supabaseAdmin = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

/**
 * Проверяет, что запрос от админа. Ожидает заголовок x-telegram-user-id (ID из Telegram WebApp).
 * Возвращает профиль админа или null.
 */
export async function getAdminFromRequest(
  request: NextRequest
): Promise<Profile | null> {
  const telegramId = request.headers.get("x-telegram-user-id");
  if (!telegramId) return null;

  const id = parseInt(telegramId, 10);
  if (Number.isNaN(id)) return null;

  const { data, error } = await supabaseAdmin()
    .from("profiles")
    .select("*")
    .eq("telegram_id", id)
    .single();

  if (error || !data) return null;
  if (data.app_role !== "admin") return null;

  return data as Profile;
}

/**
 * Проверяет, что запрос от партнёра или админа. Ожидает заголовок x-telegram-user-id.
 * Используется для API «Мои ссылки», статистики партнёра.
 */
export async function getPartnerFromRequest(
  request: NextRequest
): Promise<Profile | null> {
  const telegramId = request.headers.get("x-telegram-user-id");
  if (!telegramId) return null;

  const id = parseInt(telegramId, 10);
  if (Number.isNaN(id)) return null;

  const { data, error } = await supabaseAdmin()
    .from("profiles")
    .select("*")
    .eq("telegram_id", id)
    .single();

  if (error || !data) return null;
  if (data.app_role !== "partner" && data.app_role !== "admin") return null;

  return data as Profile;
}

export { supabaseAdmin };
