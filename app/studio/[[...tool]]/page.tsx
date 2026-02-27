import type { Metadata } from "next";

import { StudioClient } from "@/components/studio/studio-client";
import { hasValidSanityProjectId } from "@/lib/sanity/env";

export const metadata: Metadata = {
  title: "Sanity Studio",
  robots: {
    index: false,
    follow: false
  }
};


export default function StudioPage() {
  if (!hasValidSanityProjectId) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-2xl font-semibold">Sanity is not configured</h1>
        <p className="mt-4 text-sm text-zinc-300">
          Set a valid NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local (only lowercase letters, numbers, and dashes).
        </p>
      </main>
    );
  }

  return <StudioClient />;
}