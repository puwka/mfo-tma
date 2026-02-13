import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * GET /api/offer-url?offerId=...&partnerTelegramId=...
 * Возвращает URL для кнопки «Оформить»: custom_url партнёра или default_url оффера.
 * partnerTelegramId — из store/cookie (кто привёл юзера). Если нет — используем default_url.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const offerId = searchParams.get("offerId");
    const partnerTelegramIdRaw = searchParams.get("partnerTelegramId");

    if (!offerId) {
      return NextResponse.json({ error: "Нужен offerId" }, { status: 400 });
    }

    const { data: offer, error: offerError } = await supabase
      .from("offers")
      .select("id, default_url")
      .eq("id", offerId)
      .single();

    if (offerError || !offer) {
      return NextResponse.json({ error: "Оффер не найден" }, { status: 404 });
    }

    let url = offer.default_url ?? null;

    const partnerTelegramId = partnerTelegramIdRaw ? parseInt(partnerTelegramIdRaw, 10) : null;
    if (partnerTelegramId != null && !Number.isNaN(partnerTelegramId)) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("telegram_id", partnerTelegramId)
        .single();

      if (profile?.id) {
        const { data: link } = await supabase
          .from("partner_links")
          .select("custom_url")
          .eq("partner_id", profile.id)
          .eq("offer_id", offerId)
          .single();

        if (link?.custom_url) {
          url = link.custom_url;
        }
      }
    }

    return NextResponse.json({ url: url ?? "" });
  } catch (e) {
    console.error("Offer URL error:", e);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}
