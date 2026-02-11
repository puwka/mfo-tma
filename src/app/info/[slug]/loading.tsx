export default function ArticleLoading() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24 animate-pulse">
      <div className="h-5 w-20 bg-zinc-200 rounded mb-8" />
      <div className="h-8 w-full max-w-sm bg-zinc-200 rounded mb-6" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-4 bg-zinc-100 rounded"
            style={{ width: `${88 - i * 4}%` }}
          />
        ))}
      </div>
    </div>
  );
}
