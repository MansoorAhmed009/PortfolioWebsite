export default function Loading() {
  return (
    <section className="mx-auto grid min-h-[60vh] w-full max-w-3xl place-items-center px-4 py-20">
      <div className="glass-panel w-full max-w-xl rounded-2xl p-8">
        <div className="h-5 w-40 animate-pulse rounded bg-slate-700/80" />
        <div className="mt-4 h-4 w-full animate-pulse rounded bg-slate-800/80" />
        <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-slate-800/70" />
        <div className="mt-8 h-32 animate-pulse rounded-xl bg-slate-900/75" />
      </div>
    </section>
  );
}
