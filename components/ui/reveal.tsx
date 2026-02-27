import type { CSSProperties, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type RevealProps = PropsWithChildren<{
  delay?: number;
  className?: string;
}>;

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const style: CSSProperties = {
    animationDelay: `${delay}s`
  };

  return (
    <div className={cn("animate-fade-in-up", className)} style={style}>
      {children}
    </div>
  );
}