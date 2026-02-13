import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest, supabaseAdmin } from "@/lib/admin";
import type { UserRole } from "@/types/offers";

export async function GET(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() || "";

  let query = supabaseAdmin()
    .from("profiles")
    .select("id, telegram_id, username, first_name, last_name, app_role, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (q) {
    const num = parseInt(q, 10);
    if (!Number.isNaN(num)) {
      query = query.eq("telegram_id", num);
    } else {
      query = query.or(`username.ilike.%${q}%,first_name.ilike.%${q}%,last_name.ilike.%${q}%`);
    }
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const profileId = body.profileId as string | undefined;
  const app_role = body.app_role as UserRole | undefined;

  if (!profileId || !app_role) {
    return NextResponse.json(
      { error: "Нужны profileId и app_role" },
      { status: 400 }
    );
  }

  if (!["user", "partner", "admin"].includes(app_role)) {
    return NextResponse.json({ error: "Недопустимая роль" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin()
    .from("profiles")
    .update({ app_role })
    .eq("id", profileId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
