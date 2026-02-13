/**
 * Discriminated Union для офферов из Supabase (поле type + data).
 * Типы полей в data различаются: МФО — ставка в день, карты — льготный период и т.д.
 */

export type UserRole = "user" | "partner" | "admin";

// ——— МФО (Займы) ———
export interface MfoOfferData {
  type: "mfo";
  id: string;
  name: string;
  desc: string;
  logo: string;
  url: string;
  badge: string;
  rate: string; // напр. "0%/день"
  approved_count?: number;
  min_sum: number;
  max_sum: number;
  min_term: number;
  max_term: number;
}

// ——— Потребительский кредит ———
export interface CreditOfferData {
  type: "credit";
  id: string;
  name: string;
  bank_logo?: string;
  url: string;
  rate: number; // годовая ставка %
  max_sum: number;
  term_months_min?: number;
  term_months_max?: number;
  badge?: string;
}

// ——— Кредитная карта ———
export interface CardOfferData {
  type: "card";
  id: string;
  name: string;
  bank_logo?: string;
  url: string;
  grace_days: number; // льготный период (дней)
  cashback?: string;
  service_fee?: string; // стоимость обслуживания
  credit_limit?: string;
  badge?: string;
}

export type OfferData = MfoOfferData | CreditOfferData | CardOfferData;

// Строка в БД (Supabase offers)
export interface OfferRow {
  id: string;
  type: "mfo" | "credit" | "card";
  data: OfferData;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Type guards
export function isMfoOffer(data: OfferData): data is MfoOfferData {
  return data.type === "mfo";
}
export function isCreditOffer(data: OfferData): data is CreditOfferData {
  return data.type === "credit";
}
export function isCardOffer(data: OfferData): data is CardOfferData {
  return data.type === "card";
}
