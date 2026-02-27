"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { navLinks } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-700/40 bg-slate-950/65 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="focus-ring text-sm font-semibold tracking-wide text-white">
          Mansoor Ahmad
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "focus-ring rounded-lg px-3 py-2 text-sm transition",
                  active ? "bg-slate-800/80 text-cyan-200" : "text-slate-300 hover:bg-slate-800/55 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="focus-ring hidden rounded-lg border border-cyan-300/40 bg-cyan-400/10 px-3 py-2 text-xs font-medium text-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-300/20 md:inline-flex"
          >
            Let&apos;s Work
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700/70 text-slate-200 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            <span className="text-base font-semibold">{mobileOpen ? "X" : "="}</span>
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-slate-700/45 bg-slate-950/95 p-3 md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1">
            {navLinks.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "focus-ring rounded-lg px-3 py-2 text-sm transition",
                    active ? "bg-slate-800/80 text-cyan-200" : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </header>
  );
}