export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

import type { UserRole } from "./offers";

export interface Profile {
  id: string;
  telegram_id: number;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  photo_url: string | null;
  language_code: string | null;
  is_premium: boolean;
  app_role?: UserRole;
  created_at: string;
  updated_at: string;
}
