import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * GET /api/me — возвращает профиль текущего пользователя по telegram_id.
 * Ожидает заголовок x-telegram-user-id (или query telegram_id).
 * Используется для проверки роли в Middleware и RoleGuard.
 */
export async function GET(request: NextRequest) {
  try {
    const telegramId =
      request.headers.get("x-telegram-user-id") ||
      request.nextUrl.searchParams.get("telegram_id");

    if (!telegramId) {
      return NextResponse.json(
        { error: "Нужен telegram_id или заголовок x-telegram-user-id" },
        { status: 400 }
      );
    }

    const id = parseInt(telegramId, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Неверный telegram_id" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, telegram_id, first_name, last_name, username, photo_url, app_role, created_at")
      .eq("telegram_id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(null);
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error("Me API error:", e);
    return NextResponse.json(
      { error: "Ошибка загрузки профиля" },
      { status: 500 }
    );
  }
}
