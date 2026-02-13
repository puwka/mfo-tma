"use client";

import { PageHeader } from "@/components/PageHeader";

export default function CardsPage() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <PageHeader
        title="Карты"
        subtitle="Кредитные карты с льготным периодом"
      />
      <p className="text-zinc-500 text-sm mt-4">
        Список карт (льготный период, кешбэк, обслуживание) — в разработке.
      </p>
    </div>
  );
}
