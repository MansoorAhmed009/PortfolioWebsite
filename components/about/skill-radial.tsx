import { cn } from "@/lib/utils";

type SkillRadialProps = {
  label: string;
  value: number;
  description: string;
  className?: string;
};

export function SkillRadial({ label, value, description, className }: SkillRadialProps) {
  const deg = Math.min(100, Math.max(0, value)) * 3.6;
  const background = `conic-gradient(rgba(34, 211, 238, 0.95) ${deg}deg, rgba(71, 85, 105, 0.3) ${deg}deg)`;

  return (
    <div className={cn("glass-panel animate-fade-in-up rounded-2xl p-5", className)}>
      <div className="mx-auto flex w-fit items-center justify-center rounded-full p-1" style={{ background }}>
        <div className="grid h-24 w-24 place-items-center rounded-full bg-slate-950 text-lg font-semibold text-white">
          {value}%
        </div>
      </div>
      <h3 className="mt-4 text-center text-sm font-semibold text-white">{label}</h3>
      <p className="mt-2 text-center text-xs leading-relaxed text-slate-300">{description}</p>
    </div>
  );
}