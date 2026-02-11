import { PageHeader } from "@/components/PageHeader";
import { ArticleCard } from "@/components/ArticleCard";
import { ARTICLES } from "@/data/articles";

export default function InfoPage() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 space-y-6">
      <PageHeader
        title="Информация"
        subtitle="Полезные статьи о финансах"
      />

      <div className="grid gap-4">
        {ARTICLES.map((article, i) => (
          <div key={article.id} className="animate-in" style={{ animationDelay: `${i * 50}ms` }}>
            <ArticleCard article={article} />
          </div>
        ))}
      </div>
    </div>
  );
}
