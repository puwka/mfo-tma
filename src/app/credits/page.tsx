"use client";

import { PageHeader } from "@/components/PageHeader";

export default function CreditsPage() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <PageHeader
        title="Кредиты"
        subtitle="Потребительские кредиты банков"
      />
      <p className="text-zinc-500 text-sm mt-4">
        Список предложений и фильтры по ставке и сумме — в разработке.
      </p>
    </div>
  );
}
