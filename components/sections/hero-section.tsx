import { ButtonLink } from "@/components/ui/button-link";
import { MoleculeOrb } from "@/components/ui/molecule-orb";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig } from "@/lib/site-config";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-12 pt-16 sm:gap-10 sm:pb-14 sm:pt-18 md:grid-cols-[1.1fr_0.9fr] md:gap-14 md:px-6 md:pb-14 md:pt-24">
        <div className="relative">
          <Reveal>
            <p className="mb-4 inline-flex rounded-full border border-cyan-300/35 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-100">
              Personal Authority Platform
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {siteConfig.name}
              <span className="mt-2 block text-gradient">{siteConfig.title}</span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-slate-300 md:text-lg">
              Building AI-powered research infrastructure for materials science, from predictive alloy screening to
              experiment optimization and knowledge systems.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/projects">View Projects</ButtonLink>
              <ButtonLink href="/blog" variant="ghost">
                Read Blog
              </ButtonLink>
              <ButtonLink href="/contact" variant="ghost">
                Contact Me
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 text-sm text-slate-300 sm:grid-cols-3">
              <div className="glass-panel rounded-xl p-3">
                <p className="text-2xl font-semibold text-cyan-200">15+</p>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Projects</p>
              </div>
              <div className="glass-panel rounded-xl p-3">
                <p className="text-2xl font-semibold text-violet-200">7+</p>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Research Themes</p>
              </div>
              <div className="glass-panel rounded-xl p-3">
                <p className="text-2xl font-semibold text-sky-200">4</p>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Core Domains</p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="flex items-center justify-center">
          <MoleculeOrb />
        </Reveal>
      </div>
    </section>
  );
}
