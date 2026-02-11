export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-8 px-4">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-loading-dot"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <div className="h-1 w-24 rounded-full bg-zinc-100 overflow-hidden">
        <div className="h-full w-1/3 rounded-full bg-amber-300 animate-loading-bar" />
      </div>
      <p className="text-sm text-zinc-500">Загрузка</p>
    </div>
  );
}
