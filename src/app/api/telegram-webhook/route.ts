import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = process.env.BOT_TOKEN;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

interface TelegramUpdate {
  message?: {
    chat: { id: number };
    text?: string;
  };
}

/**
 * Webhook для бота Telegram.
 * Когда пользователь переходит по ссылке t.me/BotName?start=p_123,
 * бот получает /start p_123 и отправляет кнопку «Открыть приложение» (Web App).
 * По нажатию открывается Mini App внутри Telegram.
 *
 * Настройка: в BotFather установи webhook URL на https://твой-домен.vercel.app/api/telegram-webhook
 * (через setWebhook или @BotFather команду).
 */
export async function POST(request: NextRequest) {
  if (!BOT_TOKEN || !APP_URL) {
    return NextResponse.json(
      { error: "BOT_TOKEN и NEXT_PUBLIC_APP_URL должны быть заданы" },
      { status: 500 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as TelegramUpdate;
  const message = body.message;
  const text = message?.text?.trim();
  const chatId = message?.chat?.id;

  if (!chatId || !text?.startsWith("/start")) {
    return NextResponse.json({ ok: true });
  }

  const payload = text.slice(6).trim();
  const appUrl = payload ? `${APP_URL}?startapp=${encodeURIComponent(payload)}` : APP_URL;

  const replyMarkup = {
    keyboard: [
      [
        {
          text: "Открыть приложение",
          web_app: { url: appUrl },
        },
      ],
    ],
    resize_keyboard: true,
    one_time_keyboard: true,
  };

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "Нажми кнопку ниже, чтобы открыть приложение.",
        reply_markup: replyMarkup,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Telegram sendMessage error:", res.status, err);
      return NextResponse.json({ error: "sendMessage failed" }, { status: 500 });
    }
  } catch (e) {
    console.error("Telegram webhook error:", e);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
