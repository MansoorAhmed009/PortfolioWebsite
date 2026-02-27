import type { Metadata } from "next";

import { Reveal } from "@/components/ui/reveal";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact and hire inquiry page for material informatics consulting and engineering engagements."
};

export const dynamic = 'force-static';

export default function ContactPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-12 pt-12 sm:pb-14 sm:pt-14 md:px-6 md:pb-16 md:pt-20">
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal className="glass-panel rounded-2xl p-6 md:p-8">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-300/90">Contact / Hire</p>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl md:text-4xl">Technical Collaboration Inquiries</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-base">
            If you are building materials R&D systems, AI-enabled experimentation loops, or domain-aware research
            products, share your requirements and desired outcomes.
          </p>

          <div className="mt-6 space-y-3 text-sm text-slate-200">
            <div className="rounded-lg border border-slate-700/65 bg-slate-900/50 p-3">
              Consulting and architecture reviews
            </div>
            <div className="rounded-lg border border-slate-700/65 bg-slate-900/50 p-3">
              Prototype-to-production product engineering
            </div>
            <div className="rounded-lg border border-slate-700/65 bg-slate-900/50 p-3">
              Team enablement for Material Informatics workflows
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
