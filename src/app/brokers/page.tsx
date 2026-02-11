import { PageHeader } from "@/components/PageHeader";
import { BrokerCard } from "@/components/BrokerCard";
import { BROKER_OFFERS } from "@/data/brokers";

export default function BrokersPage() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 space-y-6">
      <PageHeader
        title="Сервисы подбора"
        subtitle="Агрегаторы и сервисы по подбору займов"
      />

      <div className="space-y-3">
        {BROKER_OFFERS.map((offer, i) => (
          <div key={offer.id} className="animate-in" style={{ animationDelay: `${i * 50}ms` }}>
            <BrokerCard offer={offer} />
          </div>
        ))}
      </div>
    </div>
  );
}
