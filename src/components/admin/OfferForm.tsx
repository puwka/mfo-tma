"use client";

import { useState, useEffect } from "react";
import type { OfferRow } from "@/types/offers";

type OfferType = "mfo" | "credit" | "card";

interface OfferFormProps {
  /** Редактирование: существующий оффер. Создание: null. */
  initial: OfferRow | null;
  onSubmit: (payload: { type: OfferType; data: Record<string, unknown>; default_url?: string | null; is_active?: boolean }) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const emptyMfo = (): Record<string, unknown> => ({
  type: "mfo",
  id: "",
  name: "",
  desc: "",
  logo: "",
  url: "",
  badge: "",
  rate: "",
  min_sum: 5000,
  max_sum: 30000,
  min_term: 7,
  max_term: 30,
});

const emptyCredit = (): Record<string, unknown> => ({
  type: "credit",
  id: "",
  name: "",
  url: "",
  rate: 15,
  max_sum: 500000,
  badge: "",
});

const emptyCard = (): Record<string, unknown> => ({
  type: "card",
  id: "",
  name: "",
  url: "",
  grace_days: 55,
  cashback: "",
  service_fee: "",
  credit_limit: "",
  badge: "",
});

export function OfferForm({ initial, onSubmit, onCancel, isSubmitting }: OfferFormProps) {
  const [type, setType] = useState<OfferType>(initial?.type ?? "mfo");
  const [data, setData] = useState<Record<string, unknown>>(() => {
    if (initial?.data && typeof initial.data === "object") return { ...(initial.data as unknown as Record<string, unknown>) };
    return emptyMfo();
  });
  const [default_url, setDefaultUrl] = useState(initial?.default_url ?? "");
  const [is_active, setIsActive] = useState(initial?.is_active ?? true);

  useEffect(() => {
    if (initial) {
      setType(initial.type as OfferType);
      setData(initial.data && typeof initial.data === "object" ? { ...(initial.data as unknown as Record<string, unknown>) } : emptyMfo());
      setDefaultUrl(initial.default_url ?? "");
      setIsActive(initial.is_active);
    } else {
      setType("mfo");
      setData(emptyMfo());
      setIsActive(true);
    }
  }, [initial?.id]);

  useEffect(() => {
    if (!initial) {
      if (type === "mfo") setData({ ...emptyMfo(), type });
      if (type === "credit") setData({ ...emptyCredit(), type });
      if (type === "card") setData({ ...emptyCard(), type });
    }
  }, [type, initial?.id]);

  const update = (key: string, value: unknown) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { type, data: { ...data, type }, default_url: default_url || null, is_active };
    await onSubmit(payload);
  };

  const inputCls = "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400";
  const labelCls = "block text-sm font-medium text-zinc-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelCls}>Тип оффера</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as OfferType)}
          className={inputCls}
          disabled={!!initial}
        >
          <option value="mfo">МФО (Займ)</option>
          <option value="credit">Кредит</option>
          <option value="card">Кредитная карта</option>
        </select>
        {initial && <p className="text-xs text-zinc-500 mt-1">Тип нельзя изменить при редактировании.</p>}
      </div>

      <div>
        <label className={labelCls}>Название</label>
        <input
          type="text"
          value={(data.name as string) ?? ""}
          onChange={(e) => update("name", e.target.value)}
          className={inputCls}
          placeholder="Название"
          required
        />
      </div>
      <div>
        <label className={labelCls}>URL (лендинг в data)</label>
        <input
          type="url"
          value={(data.url as string) ?? ""}
          onChange={(e) => update("url", e.target.value)}
          className={inputCls}
          placeholder="https://..."
        />
      </div>
      <div>
        <label className={labelCls}>Ссылка по умолчанию (кнопка «Оформить»)</label>
        <input
          type="url"
          value={default_url}
          onChange={(e) => setDefaultUrl(e.target.value)}
          className={inputCls}
          placeholder="https://... (ссылка админа, если партнёр не указал свою)"
        />
      </div>
      <div>
        <label className={labelCls}>Бейдж</label>
        <input
          type="text"
          value={(data.badge as string) ?? ""}
          onChange={(e) => update("badge", e.target.value)}
          className={inputCls}
          placeholder="БЫСТРО / 0%"
        />
      </div>

      {type === "mfo" && (
        <>
          <div>
            <label className={labelCls}>Описание (кратко)</label>
            <input
              type="text"
              value={(data.desc as string) ?? ""}
              onChange={(e) => update("desc", e.target.value)}
              className={inputCls}
              placeholder="До 30 000 ₽, до 21 дня"
            />
          </div>
          <div>
            <label className={labelCls}>Ставка (текст)</label>
            <input
              type="text"
              value={(data.rate as string) ?? ""}
              onChange={(e) => update("rate", e.target.value)}
              className={inputCls}
              placeholder="0%/день"
            />
          </div>
          <div>
            <label className={labelCls}>Лого (URL)</label>
            <input
              type="url"
              value={(data.logo as string) ?? ""}
              onChange={(e) => update("logo", e.target.value)}
              className={inputCls}
              placeholder="https://..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Мин. сумма (₽)</label>
              <input
                type="number"
                min={0}
                value={Number(data.min_sum) ?? 0}
                onChange={(e) => update("min_sum", Number(e.target.value) || 0)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Макс. сумма (₽)</label>
              <input
                type="number"
                min={0}
                value={Number(data.max_sum) ?? 0}
                onChange={(e) => update("max_sum", Number(e.target.value) || 0)}
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Мин. срок (дней)</label>
              <input
                type="number"
                min={0}
                value={Number(data.min_term) ?? 0}
                onChange={(e) => update("min_term", Number(e.target.value) || 0)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Макс. срок (дней)</label>
              <input
                type="number"
                min={0}
                value={Number(data.max_term) ?? 0}
                onChange={(e) => update("max_term", Number(e.target.value) || 0)}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Одобрений (опц.)</label>
            <input
              type="number"
              min={0}
              value={Number(data.approved_count) ?? ""}
              onChange={(e) => update("approved_count", e.target.value ? Number(e.target.value) : undefined)}
              className={inputCls}
              placeholder="312"
            />
          </div>
        </>
      )}

      {type === "credit" && (
        <>
          <div>
            <label className={labelCls}>Ставка (% годовых)</label>
            <input
              type="number"
              step={0.1}
              min={0}
              value={Number(data.rate) ?? ""}
              onChange={(e) => update("rate", Number(e.target.value) || 0)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Макс. сумма (₽)</label>
            <input
              type="number"
              min={0}
              value={Number(data.max_sum) ?? ""}
              onChange={(e) => update("max_sum", Number(e.target.value) || 0)}
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Срок мин (мес.)</label>
              <input
                type="number"
                min={0}
                value={Number(data.term_months_min) ?? ""}
                onChange={(e) => update("term_months_min", e.target.value ? Number(e.target.value) : undefined)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Срок макс (мес.)</label>
              <input
                type="number"
                min={0}
                value={Number(data.term_months_max) ?? ""}
                onChange={(e) => update("term_months_max", e.target.value ? Number(e.target.value) : undefined)}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Лого банка (URL)</label>
            <input
              type="url"
              value={(data.bank_logo as string) ?? ""}
              onChange={(e) => update("bank_logo", e.target.value)}
              className={inputCls}
              placeholder="https://..."
            />
          </div>
        </>
      )}

      {type === "card" && (
        <>
          <div>
            <label className={labelCls}>Льготный период (дней)</label>
            <input
              type="number"
              min={0}
              value={Number(data.grace_days) ?? ""}
              onChange={(e) => update("grace_days", Number(e.target.value) || 0)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Кешбэк</label>
            <input
              type="text"
              value={(data.cashback as string) ?? ""}
              onChange={(e) => update("cashback", e.target.value)}
              className={inputCls}
              placeholder="До 30%"
            />
          </div>
          <div>
            <label className={labelCls}>Обслуживание (₽/год)</label>
            <input
              type="text"
              value={(data.service_fee as string) ?? ""}
              onChange={(e) => update("service_fee", e.target.value)}
              className={inputCls}
              placeholder="0 или 990"
            />
          </div>
          <div>
            <label className={labelCls}>Кредитный лимит</label>
            <input
              type="text"
              value={(data.credit_limit as string) ?? ""}
              onChange={(e) => update("credit_limit", e.target.value)}
              className={inputCls}
              placeholder="До 700 000 ₽"
            />
          </div>
          <div>
            <label className={labelCls}>Лого банка (URL)</label>
            <input
              type="url"
              value={(data.bank_logo as string) ?? ""}
              onChange={(e) => update("bank_logo", e.target.value)}
              className={inputCls}
              placeholder="https://..."
            />
          </div>
        </>
      )}

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          checked={is_active}
          onChange={(e) => setIsActive(e.target.checked)}
          className="rounded border-zinc-300 text-amber-500 focus:ring-amber-400"
        />
        <label htmlFor="is_active" className="text-sm text-zinc-700">Оффер активен (показывать в приложении)</label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 font-medium hover:bg-zinc-50"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 btn-accent py-2.5 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? "Сохранение…" : initial ? "Сохранить" : "Добавить"}
        </button>
      </div>
    </form>
  );
}
