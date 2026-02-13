"use client";

import { useState, useMemo, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { LoanCalculator } from "@/components/LoanCalculator";
import { MfoCard } from "@/components/MfoCard";
import { Onboarding } from "@/components/Onboarding";
import type { MfoOffer } from "@/types";

interface OfferRow {
  id: string;
  type: string;
  data: Record<string, unknown>;
  default_url?: string | null;
}

function mapMfoOffer(row: OfferRow): MfoOffer {
  const d = row.data as Record<string, unknown>;
  return {
    id: (d.id as string) ?? row.id,
    name: (d.name as string) ?? "МФО",
    desc: (d.desc as string) ?? "",
    logo: (d.logo as string) || "https://placehold.co/56x56?text=MFO",
    url: (d.url as string) ?? "",
    badge: (d.badge as string) ?? "",
    rate: (d.rate as string) ?? "",
    approved_count: d.approved_count as number | undefined,
    min_sum: Number(d.min_sum) ?? 0,
    max_sum: Number(d.max_sum) ?? 0,
    min_term: Number(d.min_term) ?? 0,
    max_term: Number(d.max_term) ?? 0,
  };
}

export default function LoansPage() {
  const [amount, setAmount] = useState(30000);
  const [term, setTerm] = useState(30);
  const [offers, setOffers] = useState<OfferRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/offers")
      .then((r) => r.json())
      .then((data: OfferRow[]) => setOffers(Array.isArray(data) ? data : []))
      .catch(() => setOffers([]))
      .finally(() => setLoading(false));
  }, []);

  const mfoRows = useMemo(() => offers.filter((o) => o.type === "mfo"), [offers]);
  const mfoWithOffers = useMemo(
    () => mfoRows.map((row) => ({ offer: mapMfoOffer(row), offerId: row.id })),
    [mfoRows]
  );

  const filteredOffers = useMemo(() => {
    return mfoWithOffers.filter(
      ({ offer }) =>
        amount >= offer.min_sum &&
        amount <= offer.max_sum &&
        term >= offer.min_term &&
        term <= offer.max_term
    );
  }, [mfoWithOffers, amount, term]);

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 space-y-6">
      <PageHeader
        title="Займы"
        subtitle="Подберите займ под ваши условия"
      />

      <div data-onboarding-step="1">
        <LoanCalculator
          amount={amount}
          term={term}
          onAmountChange={setAmount}
          onTermChange={setTerm}
        />
      </div>

      <section data-onboarding-step="2">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">
          Подходящие предложения ({filteredOffers.length})
        </h2>
        {loading ? (
          <div className="card-base p-8 text-center">
            <p className="text-zinc-500">Загрузка…</p>
          </div>
        ) : filteredOffers.length > 0 ? (
          <div className="space-y-3">
            {filteredOffers.map(({ offer, offerId }, i) => (
              <div
                key={offerId}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <MfoCard offer={offer} offerId={offerId} />
              </div>
            ))}
          </div>
        ) : (
          <div className="card-base p-8 text-center">
            <p className="text-zinc-600">
              {mfoWithOffers.length === 0
                ? "Пока нет офферов. Админ добавит МФО в каталог."
                : "По выбранным условиям предложений не найдено."}
            </p>
            {mfoWithOffers.length > 0 && (
              <p className="text-sm text-zinc-500 mt-2">
                Попробуйте изменить сумму или срок займа.
              </p>
            )}
          </div>
        )}
      </section>

      <Onboarding />
    </div>
  );
}
