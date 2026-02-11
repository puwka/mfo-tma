"use client";

function parseBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-zinc-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export function ArticleContent({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-3 text-zinc-600">
      {lines.map((line, i) => (
        <p key={i} className="whitespace-pre-wrap">
          {parseBold(line)}
        </p>
      ))}
    </div>
  );
}
