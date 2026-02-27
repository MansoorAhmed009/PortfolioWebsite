"use client";

import { useMemo, useState } from "react";

const defaultStatus = {
  type: "idle" as "idle" | "success" | "error",
  message: ""
};

export function ContactForm() {
  const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || "";
  const [status, setStatus] = useState(defaultStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isConfigured = useMemo(() => Boolean(endpoint), [endpoint]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isConfigured) return;

    setIsSubmitting(true);
    setStatus(defaultStatus);

    const formData = new FormData(event.currentTarget);
    formData.append("_subject", "New inquiry from personal authority website");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error("Form submission failed.");
      }

      event.currentTarget.reset();
      setStatus({
        type: "success",
        message: "Message sent successfully. I will get back to you shortly."
      });
    } catch {
      setStatus({
        type: "error",
        message: "Unable to send right now. Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8">
      <h2 className="text-2xl font-semibold text-white">Let&apos;s Work Together</h2>
      <p className="mt-2 text-sm text-slate-300">
        Share your project scope, timeline, and goals. I respond to serious inquiries quickly.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-200">Your Name</span>
            <input
              type="text"
              name="name"
              required
              className="focus-ring w-full rounded-xl border border-slate-600/75 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-400"
              placeholder="Jane Doe"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-200">Email Address</span>
            <input
              type="email"
              name="email"
              required
              className="focus-ring w-full rounded-xl border border-slate-600/75 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-400"
              placeholder="jane@company.com"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm text-slate-200">Project Type</span>
          <input
            type="text"
            name="projectType"
            className="focus-ring w-full rounded-xl border border-slate-600/75 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-400"
            placeholder="Consulting, prototype, platform build..."
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-slate-200">Message</span>
          <textarea
            name="message"
            required
            rows={6}
            className="focus-ring w-full rounded-xl border border-slate-600/75 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-400"
            placeholder="Tell me about your materials AI challenge and expected outcomes."
          />
        </label>

        {!isConfigured ? (
          <p className="rounded-xl border border-amber-300/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            Set `NEXT_PUBLIC_FORMSPREE_ENDPOINT` in `.env.local` to enable submissions.
          </p>
        ) : null}

        {status.type !== "idle" ? (
          <p
            className={`rounded-xl px-4 py-3 text-sm ${
              status.type === "success"
                ? "border border-emerald-300/35 bg-emerald-500/10 text-emerald-100"
                : "border border-rose-300/35 bg-rose-500/10 text-rose-100"
            }`}
          >
            {status.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting || !isConfigured}
          className="focus-ring inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white shadow-glow transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55"
        >
          {isSubmitting ? "Sending..." : "Send Me a Message"}
        </button>
      </form>
    </div>
  );
}
