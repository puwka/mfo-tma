import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * POST /api/referral/record — записать, что текущий пользователь зашёл по ссылке партнёра.
 * Заголовок x-telegram-user-id: telegram_id текущего пользователя.
 * Body: { partnerTelegramId: number }.
 * Обновляет profiles.referred_by у текущего пользователя (только если ещё не задан).
 */
export async function POST(request: NextRequest) {
  try {
    const telegramId = request.headers.get("x-telegram-user-id");
    if (!telegramId) {
      return NextResponse.json({ error: "Нужен x-telegram-user-id" }, { status: 400 });
    }

    const currentId = parseInt(telegramId, 10);
    if (Number.isNaN(currentId)) {
      return NextResponse.json({ error: "Неверный telegram_id" }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const partnerTelegramId = body.partnerTelegramId as number | undefined;
    if (partnerTelegramId == null || Number.isNaN(Number(partnerTelegramId))) {
      return NextResponse.json({ error: "Нужен partnerTelegramId" }, { status: 400 });
    }

    if (currentId === partnerTelegramId) {
      return NextResponse.json({ ok: true });
    }

    const { data: referrer } = await supabase
      .from("profiles")
      .select("id")
      .eq("telegram_id", partnerTelegramId)
      .single();

    if (!referrer?.id) {
      return NextResponse.json({ ok: true });
    }

    const { data: current } = await supabase
      .from("profiles")
      .select("id, referred_by")
      .eq("telegram_id", currentId)
      .single();

    if (current?.referred_by) {
      return NextResponse.json({ ok: true });
    }

    if (current?.id) {
      await supabase
        .from("profiles")
        .update({ referred_by: referrer.id })
        .eq("id", current.id);
    } else {
      // Профиль ещё не создан (POST /api/profile мог не успеть). Создаём с referred_by;
      // при конфликте (профиль создан параллельно) — обновляем referred_by.
      const { error: insertError } = await supabase.from("profiles").insert({
        telegram_id: currentId,
        referred_by: referrer.id,
      });
      if (insertError?.code === "23505") {
        const { data: existing } = await supabase
          .from("profiles")
          .select("id, referred_by")
          .eq("telegram_id", currentId)
          .single();
        if (existing?.id && !existing.referred_by) {
          await supabase
            .from("profiles")
            .update({ referred_by: referrer.id })
            .eq("id", existing.id);
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Referral record error:", e);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}
