import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * POST /api/click — записать клик по офферу (для атрибуции партнёру).
 * Body: { offerId, partnerTelegramId? (кто привёл, из store), userTelegramId? (кто кликнул) }.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const offerId = body.offerId as string | undefined;
    const partnerTelegramId = body.partnerTelegramId as number | undefined;
    const userTelegramId = body.userTelegramId as number | undefined;

    if (!offerId) {
      return NextResponse.json({ error: "Нужен offerId" }, { status: 400 });
    }

    let userId: string | null = null;
    let partnerId: string | null = null;

    if (userTelegramId != null) {
      const { data: up } = await supabase
        .from("profiles")
        .select("id")
        .eq("telegram_id", userTelegramId)
        .single();
      userId = up?.id ?? null;
    }

    if (partnerTelegramId != null) {
      const { data: pp } = await supabase
        .from("profiles")
        .select("id")
        .eq("telegram_id", partnerTelegramId)
        .single();
      partnerId = pp?.id ?? null;
    }

    const { error: insertError } = await supabase.from("clicks").insert({
      offer_id: offerId,
      partner_id: partnerId,
      user_id: userId,
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Click API error:", e);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}
