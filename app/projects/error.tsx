"use client";

export default function ProjectsError({ reset }: { reset: () => void }) {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 pb-16 pt-20">
      <div className="rounded-2xl border border-rose-300/35 bg-rose-500/10 p-8">
        <h1 className="text-2xl font-semibold text-white">Unable to load projects</h1>
        <p className="mt-3 text-sm text-slate-200">Please try again. If this persists, check CMS connectivity.</p>
        <button
          type="button"
          onClick={() => reset()}
          className="focus-ring mt-6 rounded-lg border border-rose-300/40 px-4 py-2 text-sm text-rose-100"
        >
          Retry
        </button>
      </div>
    </section>
  );
}