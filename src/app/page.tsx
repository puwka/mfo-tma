"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { LoanCalculator } from "@/components/LoanCalculator";
import { MfoCard } from "@/components/MfoCard";
import { Onboarding } from "@/components/Onboarding";
import { MFO_OFFERS } from "@/data/mfo";

export default function LoansPage() {
  const [amount, setAmount] = useState(30000);
  const [term, setTerm] = useState(30);

  const filteredOffers = useMemo(() => {
    return MFO_OFFERS.filter(
      (offer) =>
        amount >= offer.min_sum &&
        amount <= offer.max_sum &&
        term >= offer.min_term &&
        term <= offer.max_term
    );
  }, [amount, term]);

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
        <div className="space-y-3">
          {filteredOffers.length > 0 ? (
            filteredOffers.map((offer, i) => (
              <div
                key={offer.id}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <MfoCard offer={offer} />
              </div>
            ))
          ) : (
            <div className="card-base p-8 text-center">
              <p className="text-zinc-600">
                По выбранным условиям предложений не найдено.
              </p>
              <p className="text-sm text-zinc-500 mt-2">
                Попробуйте изменить сумму или срок займа.
              </p>
            </div>
          )}
        </div>
      </section>

      <Onboarding />
    </div>
  );
}
