"use client";

import { ChevronRight } from "lucide-react";
import type { Article } from "@/types";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <a
      href={`/info/${article.slug}`}
      className="card-base p-4 block animate-in hover:border-amber-400"
    >
      <h3 className="font-semibold text-zinc-900 line-clamp-2">{article.title}</h3>
      <p className="text-sm text-zinc-600 mt-1 line-clamp-2">{article.preview}</p>
      <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium mt-2">
        Читать <ChevronRight className="w-4 h-4" />
      </span>
    </a>
  );
}
