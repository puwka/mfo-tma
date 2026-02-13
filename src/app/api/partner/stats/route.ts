import { NextRequest, NextResponse } from "next/server";
import { getPartnerFromRequest, supabaseAdmin } from "@/lib/admin";

/**
 * GET /api/partner/stats — статистика кликов по офферам для текущего партнёра.
 * Заголовок x-telegram-user-id: telegram_id партнёра.
 * Возвращает: { rows: [{ offer_id, offer_name, clicks_total, clicks_unique }] }
 */
export async function GET(request: NextRequest) {
  const profile = await getPartnerFromRequest(request);
  if (!profile) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const supabase = supabaseAdmin();

  const { count: referralsCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("referred_by", profile.id as string);

  const { data: clicks, error: clicksError } = await supabase
    .from("clicks")
    .select("offer_id, user_id")
    .eq("partner_id", profile.id as string);

  if (clicksError) {
    return NextResponse.json({ error: clicksError.message }, { status: 500 });
  }

  const byOffer = new Map<string, { total: number; unique: Set<string> }>();
  for (const c of clicks ?? []) {
    const cur = byOffer.get(c.offer_id) ?? { total: 0, unique: new Set<string>() };
    cur.total += 1;
    if (c.user_id) cur.unique.add(c.user_id);
    byOffer.set(c.offer_id, cur);
  }

  const offerIds = [...byOffer.keys()];
  if (offerIds.length === 0) {
    return NextResponse.json({ rows: [], referralsCount: referralsCount ?? 0 });
  }

  const { data: offers } = await supabase
    .from("offers")
    .select("id, data")
    .in("id", offerIds);

  const nameById = new Map(
    (offers ?? []).map((o) => [o.id, (o.data as { name?: string })?.name ?? o.id])
  );

  const rows = offerIds.map((offer_id) => {
    const stat = byOffer.get(offer_id)!;
    return {
      offer_id,
      offer_name: nameById.get(offer_id) ?? offer_id,
      clicks_total: stat.total,
      clicks_unique: stat.unique.size,
    };
  });

  return NextResponse.json({ rows, referralsCount: referralsCount ?? 0 });
}
