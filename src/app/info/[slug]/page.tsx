import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ARTICLES } from "@/data/articles";
import { ArticleContent } from "@/components/ArticleContent";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6">
        <p className="text-zinc-600">Статья не найдена</p>
        <Link href="/info" className="text-amber-600 mt-4 inline-block">
          ← Вернуться к списку
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <Link
        href="/info"
        className="inline-flex items-center gap-2 text-zinc-600 hover:text-amber-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад
      </Link>

      <article>
        <h1 className="text-2xl font-bold text-zinc-900">{article.title}</h1>
        <div className="mt-4 prose prose-zinc prose-sm max-w-none">
          <ArticleContent content={article.content || article.preview} />
        </div>
      </article>
    </div>
  );
}
