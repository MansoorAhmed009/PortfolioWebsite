import { Reveal } from "@/components/ui/reveal";
import { skillStats } from "@/lib/mock-data";

export function AboutPreviewSection() {
  return (
    <section className="mx-auto mt-5 sm:mt-6 md:mt-8 w-full max-w-6xl px-4 md:px-6">
      <Reveal className="glass-panel rounded-3xl p-6 md:p-8">
        <div className="grid gap-8 md:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-cyan-300/90">About Me</p>
            <h2 className="text-2xl font-semibold text-white md:text-3xl">Applied Systems Thinking for Materials R&D</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-base">
              I combine metallurgy knowledge, data-driven modeling, and product engineering to build practical research
              systems. My approach links data pipelines, simulation insights, and lab workflows into faster decision
              loops.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {skillStats.map((skill, index) => (
              <Reveal key={skill.label} delay={0.06 * index} className="rounded-2xl border border-slate-700/70 bg-slate-900/45 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-white">{skill.label}</p>
                  <p className="text-sm text-cyan-200">{skill.value}%</p>
                </div>
                <div className="h-2 rounded-full bg-slate-700/70">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-300"
                    style={{ width: `${skill.value}%` }}
                  />
                </div>
                <p className="mt-3 text-xs text-slate-300">{skill.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
