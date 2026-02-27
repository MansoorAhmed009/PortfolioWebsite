import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
};

export function ButtonLink({ href, children, className, variant = "primary", ...rest }: ButtonLinkProps) {
  const styles =
    variant === "primary"
      ? "rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 px-5 py-2.5 text-sm font-medium text-white shadow-glow transition hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.35),0_16px_45px_rgba(99,102,241,0.45)]"
      : "rounded-xl border border-slate-400/30 bg-slate-800/45 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-300/55 hover:text-white";

  return (
    <Link href={href} className={cn("focus-ring inline-flex items-center justify-center", styles, className)} {...rest}>
      {children}
    </Link>
  );
}
