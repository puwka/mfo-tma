import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest, supabaseAdmin } from "@/lib/admin";

/**
 * GET /api/admin/referrals — кто от кого пришёл (для админа).
 * Возвращает: { referrals: [...], byPartner: [...] }
 */
export async function GET(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const supabase = supabaseAdmin();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, telegram_id, first_name, last_name, username, referred_by")
    .not("referred_by", "is", null)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const referredList = profiles ?? [];
  const referrerIds = [...new Set(referredList.map((p) => p.referred_by).filter(Boolean))] as string[];

  let referrers: Array<{ id: string; telegram_id: number; first_name: string | null; last_name: string | null; username: string | null }> = [];
  if (referrerIds.length > 0) {
    const { data: refs } = await supabase
      .from("profiles")
      .select("id, telegram_id, first_name, last_name, username")
      .in("id", referrerIds);
    referrers = refs ?? [];
  }

  const referrerById = new Map(referrers.map((r) => [r.id, r]));

  const referrals = referredList.map((p) => {
    const ref = referrerById.get(p.referred_by!);
    return {
      user_telegram_id: p.telegram_id,
      user_name: [p.first_name, p.last_name].filter(Boolean).join(" ") || `@${p.username}` || String(p.telegram_id),
      user_username: p.username,
      referred_by_telegram_id: ref?.telegram_id,
      referred_by_name: ref ? [ref.first_name, ref.last_name].filter(Boolean).join(" ") || `@${ref.username}` || String(ref.telegram_id) : null,
    };
  });

  const byPartnerMap = new Map<number, number>();
  for (const p of referredList) {
    const ref = referrerById.get(p.referred_by!);
    if (ref?.telegram_id != null) {
      byPartnerMap.set(ref.telegram_id, (byPartnerMap.get(ref.telegram_id) ?? 0) + 1);
    }
  }

  const byPartner = referrers.map((r) => ({
    partner_telegram_id: r.telegram_id,
    partner_name: [r.first_name, r.last_name].filter(Boolean).join(" ") || `@${r.username}` || String(r.telegram_id),
    count: byPartnerMap.get(r.telegram_id) ?? 0,
  })).sort((a, b) => b.count - a.count);

  return NextResponse.json({ referrals, byPartner });
}
