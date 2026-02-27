import type { Metadata } from "next";

import { SkillRadial } from "@/components/about/skill-radial";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { skillStats } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "About",
  description: "About the systems-thinking approach, technical strengths, and philosophy behind this Material Informatics practice."
};

export default function AboutPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-12 pt-12 sm:pb-14 sm:pt-14 md:px-6 md:pb-16 md:pt-20">
      <Reveal>
        <SectionHeading
          eyebrow="About"
          title="Research-Grade Engineering with Product Execution"
          description="I build production-ready data and AI systems grounded in physical metallurgy context, experimental constraints, and measurable outcomes."
        />
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2">
        <Reveal className="glass-panel rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-white">Philosophy</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-base">
            Material informatics succeeds when modeling, domain insight, and operational delivery are tightly integrated.
            I prioritize systems that accelerate scientific decision-making while staying interpretable to technical
            stakeholders.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-slate-200">
            <li className="rounded-lg border border-slate-700/60 bg-slate-900/50 p-3">
              Evidence-first modeling with explicit assumptions and traceability.
            </li>
            <li className="rounded-lg border border-slate-700/60 bg-slate-900/50 p-3">
              Experiment-aware AI that respects lab throughput and uncertainty.
            </li>
            <li className="rounded-lg border border-slate-700/60 bg-slate-900/50 p-3">
              Productized interfaces for repeatable team adoption, not notebook silos.
            </li>
          </ul>
        </Reveal>

        <Reveal className="glass-panel rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-white">Technical Profile</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            Balanced coverage across data science, software delivery, and materials domain modeling.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {skillStats.map((skill) => (
              <SkillRadial
                key={skill.label}
                label={skill.label}
                value={skill.value}
                description={skill.description}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
