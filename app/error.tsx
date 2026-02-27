"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-bg-950 px-4 py-20 text-slate-100">
        <section className="mx-auto max-w-2xl rounded-2xl border border-rose-300/35 bg-rose-500/10 p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-rose-200">Application Error</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Something went wrong</h1>
          <p className="mt-3 text-sm text-slate-200">An unexpected error occurred while rendering this page.</p>
          <button
            type="button"
            onClick={() => reset()}
            className="focus-ring mt-6 rounded-lg border border-rose-300/45 px-4 py-2 text-sm text-rose-100 hover:bg-rose-400/10"
          >
            Try Again
          </button>
        </section>
      </body>
    </html>
  );
}