import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto grid min-h-[58vh] w-full max-w-3xl place-items-center px-4 py-20 text-center">
      <div className="glass-panel rounded-2xl p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/90">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Page not found</h1>
        <p className="mt-3 text-sm text-slate-300 md:text-base">
          The route may have changed or the content is not published yet.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="focus-ring inline-flex rounded-xl border border-cyan-300/45 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 transition hover:bg-cyan-300/20"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
