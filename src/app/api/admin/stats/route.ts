import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest, supabaseAdmin } from "@/lib/admin";

export async function GET(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const supabase = supabaseAdmin();

  const [usersRes, clicksRes] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("clicks").select("id", { count: "exact", head: true }),
  ]);

  const usersCount = usersRes.count ?? 0;
  const clicksCount = clicksRes.count ?? 0;

  return NextResponse.json({ usersCount, clicksCount });
}
