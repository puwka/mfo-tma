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
  const type = body.type as string | undefined;
  const data = body.data as Record<string, unknown> | undefined;

  if (!offerId) {
    return NextResponse.json({ error: "Нужен offerId" }, { status: 400 });
  }

  const updates: { is_active?: boolean; type?: string; data?: Record<string, unknown> } = {};
  if (typeof is_active === "boolean") updates.is_active = is_active;
  if (type && ["mfo", "credit", "card"].includes(type)) {
    updates.type = type;
    if (data && typeof data === "object") updates.data = { ...data, type };
  } else if (data && typeof data === "object") {
    updates.data = data;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Нужны is_active, type или data" }, { status: 400 });
  }

  const { data: row, error } = await supabaseAdmin()
    .from("offers")
    .update(updates)
    .eq("id", offerId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(row);
}

export async function DELETE(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const offerId = searchParams.get("offerId");

  if (!offerId) {
    return NextResponse.json({ error: "Нужен offerId в query" }, { status: 400 });
  }

  const { error } = await supabaseAdmin()
    .from("offers")
    .delete()
    .eq("id", offerId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
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

  const id = typeof data.id === "string" ? data.id : crypto.randomUUID();
  const payload = { type, data: { ...data, type, id }, is_active: true };

  const { data: row, error } = await supabaseAdmin()
    .from("offers")
    .insert(payload)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(row);
}
