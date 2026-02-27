export default function ProjectsLoading() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-16 md:px-6 md:pt-20">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="glass-panel animate-pulse rounded-2xl p-6">
            <div className="h-40 rounded-xl bg-slate-800/70" />
            <div className="mt-4 h-6 rounded bg-slate-700/70" />
            <div className="mt-3 h-4 rounded bg-slate-800/70" />
            <div className="mt-2 h-4 w-5/6 rounded bg-slate-800/70" />
          </div>
        ))}
      </div>
    </section>
  );
}