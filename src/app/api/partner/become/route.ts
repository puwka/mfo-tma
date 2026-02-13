import { NextRequest, NextResponse } from "next/server";
import { getPartnerFromRequest, supabaseAdmin } from "@/lib/admin";

/**
 * POST /api/partner/become — выдать текущему пользователю роль partner.
 * Заголовок x-telegram-user-id: telegram_id пользователя (любого).
 * Любой пользователь может стать партнёром по кнопке «Стать партнером».
 */
export async function POST(request: NextRequest) {
  const telegramId = request.headers.get("x-telegram-user-id");
  if (!telegramId) {
    return NextResponse.json({ error: "Нужен x-telegram-user-id" }, { status: 400 });
  }

  const id = parseInt(telegramId, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Неверный telegram_id" }, { status: 400 });
  }

  const supabase = supabaseAdmin();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, app_role")
    .eq("telegram_id", id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Профиль не найден. Сначала откройте приложение из Telegram." }, { status: 404 });
  }

  if (profile.app_role === "partner" || profile.app_role === "admin") {
    return NextResponse.json({ message: "Уже партнёр", profile });
  }

  const { data: updated, error } = await supabase
    .from("profiles")
    .update({ app_role: "partner" })
    .eq("id", profile.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Вы стали партнёром", profile: updated });
}
