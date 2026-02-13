import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest, supabaseAdmin } from "@/lib/admin";

export async function GET(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin()
    .from("offers")
    .select("id, type, data, is_active, created_at")
    .order("created_at", { ascending: false });

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
  const offerId = body.offerId as string | undefined;
  const is_active = body.is_active as boolean | undefined;

  if (!offerId || typeof is_active !== "boolean") {
    return NextResponse.json(
      { error: "Нужны offerId и is_active" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin()
    .from("offers")
    .update({ is_active })
    .eq("id", offerId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const type = body.type as string | undefined;
  const data = body.data as Record<string, unknown> | undefined;

  if (!type || !data || !["mfo", "credit", "card"].includes(type)) {
    return NextResponse.json(
      { error: "Нужны type (mfo|credit|card) и data (объект)" },
      { status: 400 }
    );
  }

  const { data: row, error } = await supabaseAdmin()
    .from("offers")
    .insert({ type, data: { ...data, type }, is_active: true })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(row);
}
