import type { Metadata } from "next";

import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProjects } from "@/lib/sanity/data";
import { ProjectsList } from "@/components/projects/projects-list";

export const metadata: Metadata = {
  title: "Projects",
  description: "Interactive portfolio of materials AI and engineering projects with problem framing, stack, and outcomes."
};

// use a numeric literal so the config export is valid
export const revalidate = 60; // faster project updates

export default async function ProjectsPage() {
  const initialProjects = await getProjects({ limit: 20 });

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-12 pt-12 sm:pb-14 sm:pt-14 md:px-6 md:pb-16 md:pt-20">
      <Reveal>
        <SectionHeading
          eyebrow="Portfolio"
          title="Project Case Studies"
          description="Each project emphasizes problem definition, technical implementation, and measurable impact."
        />
      </Reveal>

      <ProjectsList initialProjects={initialProjects} />
    </section>
  );
}