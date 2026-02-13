import { NextRequest, NextResponse } from "next/server";
import { getPartnerFromRequest, supabaseAdmin } from "@/lib/admin";

/**
 * GET /api/partner/offers — офферы с привязкой ссылок текущего партнёра.
 * Заголовок x-telegram-user-id: telegram_id партнёра.
 * Возвращает: список офферов + custom_url из partner_links (LEFT JOIN).
 */
export async function GET(request: NextRequest) {
  const profile = await getPartnerFromRequest(request);
  if (!profile) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const supabase = supabaseAdmin();

  const { data: offers, error: offersError } = await supabase
    .from("offers")
    .select("id, type, data, default_url, is_active")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (offersError) {
    return NextResponse.json({ error: offersError.message }, { status: 500 });
  }

  const { data: links } = await supabase
    .from("partner_links")
    .select("offer_id, custom_url")
    .eq("partner_id", profile.id as string);

  const linkByOffer = new Map((links ?? []).map((l) => [l.offer_id, l.custom_url ?? ""]));

  const list = (offers ?? []).map((o) => ({
    ...o,
    custom_url: linkByOffer.get(o.id) ?? "",
  }));

  return NextResponse.json(list);
}
