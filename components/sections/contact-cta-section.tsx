import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";

export function ContactCtaSection() {
  return (
    <section className="mx-auto mb-12 sm:mb-14 md:mb-16 mt-16 sm:mt-20 md:mt-24 w-full max-w-6xl px-4 md:px-6">
      <Reveal className="glass-panel animated-outline rounded-3xl p-6 sm:p-8 md:p-10">
        <div className="grid gap-6 sm:gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.24em] text-cyan-300/90">Contact / Hire</p>
            <h2 className="text-2xl font-semibold text-white sm:text-3xl md:text-4xl">Let&apos;s Build Applied AI for Materials R&D</h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
              Open to consulting, product collaboration, and research-focused engineering engagements.
            </p>
          </div>
          <div className="flex justify-start md:justify-end">
            <ButtonLink href="/contact">Send Me a Message</ButtonLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
