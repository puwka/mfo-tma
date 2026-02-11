import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { TelegramUser } from "@/types/profile";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = body.user as TelegramUser | undefined;

    if (!user?.id) {
      return NextResponse.json(
        { error: "Отсутствуют данные пользователя" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          telegram_id: user.id,
          first_name: user.first_name ?? null,
          last_name: user.last_name ?? null,
          username: user.username ?? null,
          photo_url: user.photo_url ?? null,
          language_code: user.language_code ?? null,
          is_premium: user.is_premium ?? false,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "telegram_id" }
      )
      .select()
      .single();

    if (error) {
      console.error("Profile upsert error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error("Profile API error:", e);
    return NextResponse.json(
      { error: "Ошибка сохранения профиля" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const telegramId = searchParams.get("telegram_id");

    if (!telegramId) {
      return NextResponse.json(
        { error: "Нужен telegram_id" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("telegram_id", parseInt(telegramId, 10))
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(null);
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error("Profile GET error:", e);
    return NextResponse.json(
      { error: "Ошибка загрузки профиля" },
      { status: 500 }
    );
  }
}
