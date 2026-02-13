import { NextRequest, NextResponse } from "next/server";
import { getPartnerFromRequest, supabaseAdmin } from "@/lib/admin";

/**
 * PUT /api/partner/links — сохранить/обновить ссылку партнёра на оффер.
 * Body: { offerId, custom_url }.
 * Заголовок x-telegram-user-id: telegram_id партнёра.
 */
export async function PUT(request: NextRequest) {
  const profile = await getPartnerFromRequest(request);
  if (!profile) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const offerId = body.offerId as string | undefined;
  const custom_url = typeof body.custom_url === "string" ? body.custom_url.trim() : "";

  if (!offerId) {
    return NextResponse.json({ error: "Нужен offerId" }, { status: 400 });
  }

  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("partner_links")
    .upsert(
      {
        partner_id: profile.id as string,
        offer_id: offerId,
        custom_url: custom_url || "",
      },
      { onConflict: "partner_id,offer_id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
