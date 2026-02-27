import type { PropsWithChildren } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FuturisticBackground } from "@/components/ui/futuristic-background";

export function SiteShell({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-bg-950 text-slate-100">
      <FuturisticBackground />
      <SiteHeader />
      <main className="relative z-10">{children}</main>
      <SiteFooter />
    </div>
  );
}
