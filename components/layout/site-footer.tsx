import Link from "next/link";

import { navLinks } from "@/lib/navigation";

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-24 border-t border-slate-700/45 bg-slate-950/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:px-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Mansoor Ahmad</p>
            <p className="mt-2 max-w-md text-sm text-slate-300">
              Material Informatics Engineer building AI-first systems for accelerated materials discovery and
              experiment intelligence.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="focus-ring rounded-lg border border-slate-700/65 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-300/45 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-800/90 pt-5 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Mansoor Ahmad. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a className="focus-ring hover:text-cyan-200" href="https://github.com" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a
              className="focus-ring hover:text-cyan-200"
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <Link className="focus-ring hover:text-cyan-200" href="/admin/login">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
