export default function AdminLoading() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-16 pt-16 md:px-6 md:pt-20">
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="glass-panel animate-pulse rounded-2xl p-6">
            <div className="h-6 rounded bg-slate-700/70" />
            <div className="mt-3 h-4 rounded bg-slate-800/70" />
            <div className="mt-2 h-4 w-5/6 rounded bg-slate-800/70" />
            <div className="mt-5 h-8 w-20 rounded bg-slate-700/70" />
          </div>
        ))}
      </div>
    </section>
  );
}